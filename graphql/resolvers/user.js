const { ApolloError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Token = require("../../models/token");

module.exports = {
  Query: {},
  Mutation: {
    async login(_, { user }) {
      try {
        //check if user exists in database:
        let _user = await User.findOne({ email: user.email });
        //send error if no user found:
        if (!_user) {
          throw new Error("Uživatel nebyl nalezen!");
        } else {
          //check if password is valid:
          let valid = await bcrypt.compare(user.password, _user.password);
          if (valid) {
            //generate a pair of tokens if valid and send
            let accessToken = await _user.createAccessToken();
            let refreshToken = await _user.createRefreshToken();
            return { accessToken, refreshToken };
          } else {
            //send error if password is invalid
            throw new Error("Neplatné heslo!");
          }
        }
      } catch (error) {
        console.error(error);
        throw new ApolloError(error.message, 401);
      }
    },
    async createUser(_, { user }) {
      try {
        //check if username is already taken:
        let _user = await User.findOne({ email: user.email });
        if (_user) {
          throw new Error("Email je již použit.");
        } else {
          //create new user and generate a pair of tokens and send
          _user = await new User(user).save();
          let accessToken = await _user.createAccessToken();
          let refreshToken = await _user.createRefreshToken();
          return { accessToken, refreshToken };
        }
      } catch (error) {
        console.error(error);
        throw new ApolloError(error.message, 401);
      }
    },

    async logout(_, { token }) {
      try {
        //delete the refresh token saved in database:
        const { refreshToken } = token;
        await Token.findOneAndDelete({ token: refreshToken });
        return { status: "success", text: "Byl si úspěšně odhlášen" };
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
  },
};
