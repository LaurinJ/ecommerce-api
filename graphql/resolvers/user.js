const { ApolloError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
  Query: {
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
            let accessToken = await user.createAccessToken();
            let refreshToken = await user.createRefreshToken();

            return { accessToken, refreshToken };
          } else {
            //send error if password is invalid
            throw new Error("Neplatné heslo!");
          }
        }
      } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error!");
      }
    },
  },
  Mutation: {
    async createUser(_, { user }) {
      console.log(user);
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
          console.log(accessToken, refreshToken);
          return { accessToken, refreshToken };
        }
      } catch (error) {
        console.error(error);
        throw new ApolloError(error.message, 401);
      }
    },
  },
};
