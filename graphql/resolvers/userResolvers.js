import { ApolloError, UserInputError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/user.js";
import { Token } from "../../models/token.js";
import { Email } from "../../models/email.js";
import { emailValidator } from "../../validators/emailValidator.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const userResolvers = {
  Query: {},
  Mutation: {
    async login(_, { user }) {
      try {
        //check if user exists in database:
        let _user = await User.findOne({ email: user.email });
        //send error if no user found:
        if (!_user) {
          throw new UserInputError("Uživatel nebyl nalezen!");
        } else {
          //check if password is valid:
          let valid = await bcrypt.compare(user.password, _user.password);
          if (valid) {
            //generate a pair of tokens if valid and send
            let accessToken = await _user.createAccessToken();
            let refreshToken = await _user.createRefreshToken();
            return { accessToken, refreshToken, user: _user };
          } else {
            //send error if password is invalid
            throw new UserInputError("Neplatný email nebo heslo!");
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
        errors.push("Jméno je již obsazeno.");
      }
      if (_user) {
        errors.push("Email je již použit");
      }
      if (user.password !== user.confirm_password) {
        errors.push("Hesla se neshodují.");
      }
      if (errors.length != 0) {
        throw new UserInputError("Invalid argument value", {
          errors: errors,
        });
      }
      //create new user and generate a pair of tokens and send
      _user = await new User(user).save();
      let accessToken = await _user.createAccessToken();
      let refreshToken = await _user.createRefreshToken();
      return { accessToken, refreshToken, user: _user };
    },

    async logout(_, { token }) {
      try {
        //delete the refresh token saved in database:
        const { refreshToken } = token;
        await Token.findOneAndDelete({ token: refreshToken });
        return { status: 204, message: "Byl si úspěšně odhlášen" };
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
          throw new Error("RefreshToken nebyl odeslán!");
        } else {
          //query for the token to check if it is valid:
          const tokenDoc = await Token.findOne({ token: refreshToken });
          //send error if no token found:
          if (!tokenDoc) {
            throw new Error("Platnost tokenu vypršela!");
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
        user = await User.findOne({ email: email }).exec();
        // if the user exists, create a token or register the user
        if (user) {
          let accessToken = await user.createAccessToken();
          let refreshToken = await user.createRefreshToken();
          const { _id, email: _email, role, name: _name } = user;
          return {
            accessToken,
            refreshToken,
            user: { _id, _email, role, _name },
          };
        } else {
          const newUser = await new User({
            name: name,
            email: email,
            password: jti,
          }).save();
          let accessToken = await newUser.createAccessToken();
          let refreshToken = await newUser.createRefreshToken();
          const { _id, email: _email, role, name: _name } = newUser;
          return {
            accessToken,
            refreshToken,
            user: { _id, _email, role, _name },
          };
        }
      }
      throw new UserInputError("Google login failed. Try again.");
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
        return { message: "Okiii" };
      }
      throw new UserInputError(error);
    },
  },
};
