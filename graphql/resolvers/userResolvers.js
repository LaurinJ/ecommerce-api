import { ApolloError, UserInputError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/user.js";
import { Token } from "../../models/token.js";
import { Email } from "../../models/email.js";
import { FavoriteProduct } from "../../models/favoriteProduct.js";
import { Profile } from "../../models/profile.js";
import {
  passwordValidator,
  changePasswordValidator,
} from "../../validators/password.js";
import { emailValidator } from "../../validators/email.js";
import { isAuthenticate } from "../../helpers/user.js";
import { passwordResetEmail } from "../../helpers/email.js";
import { checkToken } from "../../helpers/token.js";
import { uploadProcess } from "../../helpers/image.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const userResolvers = {
  EditProfile: {
    __resolveType: (obj) => {
      if (obj.message) {
        return "Message";
      }
      if (obj.profile_image) {
        return "Profile";
      }
      return null;
    },
  },
  Query: {
    async getUsersCount(_, {}, { user }) {
      isAuthenticate(user);
      const _users = await User.find({}).countDocuments();
      return { users: _users || 0 };
    },

    async checkResetPasswordToken(_, { token }) {
      try {
        // check token
        const data = checkToken(token);
        return { status: true, email: data.email };
      } catch {
        return { status: false, email: "" };
      }
    },

    async getFavoriteProducts(_, { limit = 10, skip = 1 }, { user }) {
      isAuthenticate(user);

      const page = (skip - 1) * limit;

      // search the number of favorites
      const count = await FavoriteProduct.find({
        user: user._id,
      }).countDocuments();
      // count pages
      const pages = Math.ceil(Number(count) / Number(limit));

      // search for products or return an empty field
      let products = count
        ? await FavoriteProduct.find({
            user: user._id,
          })
            .populate("product")
            .sort("-createdAt")
            .skip(page)
            .limit(limit)
        : [];

      // pull products out of the result
      products = products.map((item) => item.product);

      return { products: products, pages: pages };
    },
  },
  Mutation: {
    async login(_, { user }) {
      try {
        //check if user exists in database:
        let _user = await User.findOne({ email: user.email }).populate(
          "profile",
          "profile_image"
        );
        //send error if no user found:
        if (!_user) {
          throw new UserInputError("U??ivatel nebyl nalezen!");
        } else {
          //check if password is valid:
          let valid = await bcrypt.compare(user.password, _user.password);
          if (valid) {
            //generate a pair of tokens if valid and send
            let accessToken = await _user.createAccessToken();
            let refreshToken = await _user.createRefreshToken();
            delete _user.password;
            return { accessToken, refreshToken, user: _user };
          } else {
            //send error if password is invalid
            throw new UserInputError("Neplatn?? email nebo heslo!");
          }
        }
      } catch (error) {
        console.error(error);
        throw new ApolloError(error.message, 401);
      }
    },

    async createUser(_, { user }) {
      //check if username is already taken:
      let _user = await User.findOne({ email: user.email });
      let name = await User.findOne({ name: user.name });
      let errors = [];
      if (name) {
        errors.push("Jm??no je ji?? obsazeno.");
      }
      if (_user) {
        errors.push("Email je ji?? pou??it");
      }
      if (user.password !== user.confirm_password) {
        errors.push("Hesla se neshoduj??.");
      }
      if (errors.length != 0) {
        throw new UserInputError("Invalid argument value", {
          errors: errors,
        });
      }
      //create new user and generate a pair of tokens and send
      _user = new User(user);
      await _user.generatePassword();
      await _user.createProfile();
      await _user.save();
      let accessToken = await _user.createAccessToken();
      let refreshToken = await _user.createRefreshToken();
      return { accessToken, refreshToken, user: _user };
    },

    async logout(_, { token }) {
      try {
        //delete the refresh token saved in database:
        const { refreshToken } = token;
        await Token.findOneAndDelete({ token: refreshToken });
        return { message: "Byl si ??sp????n?? odhl????en" };
      } catch (error) {
        console.error(error);
        throw new ApolloError(error.message, 401);
      }
    },

    async generateRefreshToken(_, { token }) {
      try {
        //get refreshToken
        const { refreshToken } = token;
        //send error if no refreshToken is sent
        if (!refreshToken) {
          throw new Error("RefreshToken nebyl odesl??n!");
        } else {
          //query for the token to check if it is valid:
          const tokenDoc = await Token.findOne({ token: refreshToken });
          //send error if no token found:
          if (!tokenDoc) {
            throw new Error("Platnost tokenu vypr??ela!");
          } else {
            //extract payload from refresh token and generate a new access token and send it
            const payload = jwt.verify(
              tokenDoc.token,
              process.env.REFRESH_TOKEN_SECRET
            );
            const accessToken = jwt.sign(
              { user: payload },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "10m",
              }
            );
            return { accessToken: accessToken };
          }
        }
      } catch (error) {
        console.error(error);
        throw new ApolloError(error.message, 401);
      }
    },

    async googleLogin(_, { token }) {
      let user;
      const idToken = token;
      // check google idToken
      const response = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email_verified, email, name, jti } = response.payload;
      // check if the email is verified
      if (email_verified) {
        user = await User.findOne({ email: email }).populate(
          "profile",
          "profile_image"
        );
        // if the user exists, create a token or register the user
        if (user) {
          let accessToken = await user.createAccessToken();
          let refreshToken = await user.createRefreshToken();
          delete user.password;
          return {
            accessToken,
            refreshToken,
            user: user,
          };
        } else {
          const newUser = await new User({
            name: name,
            email: email,
            password: jti,
          });
          await newUser.createProfile();
          await newUser.save();
          let accessToken = await newUser.createAccessToken();
          let refreshToken = await newUser.createRefreshToken();
          delete newUser.password;
          return {
            accessToken,
            refreshToken,
            user: newUser,
          };
        }
      }
      throw new UserInputError("Google login failed. Try again.");
    },

    async changePassword(_, { passwords }, { user }) {
      isAuthenticate(user);
      // check passwords
      const passwordsErrors = changePasswordValidator(passwords);
      if (Object.keys(passwordsErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: passwordsErrors,
        });
      }
      //check if user exists in database:
      let _user = await User.findOne({ _id: user._id });
      //send error if no user found:
      if (!_user) {
        throw new UserInputError("U??ivatel nebyl nalezen!");
      } else {
        //check if password is valid:
        let valid = await bcrypt.compare(
          passwords.old_password,
          _user.password
        );
        if (valid) {
          // change password
          await _user.changePassword(passwords.password);
          return { message: "Heslo bylo ??sp????n?? zm??n??no" };
        } else {
          //send error if password is invalid
          throw new UserInputError("Neplatn?? star?? heslo!");
        }
      }
    },

    async sendChangeEmail(_, { email }) {
      // check email
      const emailError = emailValidator(email);
      if (emailError) {
        throw new UserInputError(emailError);
      }
      // send email
      passwordResetEmail(email);
      return { message: "Email na zm??nu hesla byl odesl??n!" };
    },

    async resetPassword(_, { passwords, email }) {
      // check passwords
      const passwordsErrors = passwordValidator(passwords);
      if (Object.keys(passwordsErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: passwordsErrors,
        });
      }
      //check if user exists in database:
      let _user = await User.findOne({ email: email });
      //send error if no user found:
      if (!_user) {
        throw new UserInputError("U??ivatel nebyl nalezen!");
      } else {
        // change password
        await _user.changePassword(passwords.password);
        return { message: "Heslo bylo ??sp????n?? zm??n??no" };
      }
    },

    async subscribeToNews(_, { email }) {
      // check email
      const error = emailValidator(email);
      if (!error) {
        // check if the email does not exist
        const _email = await Email.findOne({ email: email });
        if (!_email) {
          // save email
          const data = new Email({ email: email });
          await data.save();
        }
        return { message: "??sp????n?? jste se p??ihl??sil(a) k odb??r novinek." };
      }
      throw new UserInputError(error);
    },

    async addToFavorites(_, { id }, { user }) {
      isAuthenticate(user);
      // check id
      if (!id) throw new ApolloError("Neplatn?? id!");
      // check if it has not already been added
      const exist = await FavoriteProduct.findOne({
        user: user._id,
        product: id,
      });
      if (exist)
        return {
          message: "Produkt u?? byl p??id??n mezi obl??ben??",
        };
      const _favorite = new FavoriteProduct({ user: user._id, product: id });
      await _favorite.save();
      return { message: "Produkt byl p??id??n do obl??ben??ch" };
    },

    async deleteFavorite(_, { id }, { user }) {
      isAuthenticate(user);
      // check id
      if (!id) throw new ApolloError("Neplatn?? id!");
      // find and delete favorite product
      const _favorite = await FavoriteProduct.findOneAndDelete({
        user: user._id,
        product: id,
      });
      if (_favorite)
        return {
          message: "Produkt byl odstran??n z oblibenych!",
        };
      return { message: "N??co se pokazilo!" };
    },

    async editProfile(_, { image }, { user }) {
      isAuthenticate(user);

      if (image) {
        const img = await uploadProcess(image, "profile/");
        const _user = await User.findById(user._id).populate("profile");
        if (_user) {
          let profile = await Profile.findById(_user.profile._id);
          profile.profile_image = img;
          const data = await profile.save();
          return data;
        }
        return { message: "N??co se pokazilo!" };
      }

      return { message: "N??co se pokazilo!" };
    },
  },
};
