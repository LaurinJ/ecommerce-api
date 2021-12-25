// const {
//   ApolloError,
//   UserInputError,
//   ValidationError,
// } = require("apollo-server-express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../../models/user");
// const Token = require("../../models/token");

import {
  ApolloError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
import { Token } from "../../models/token.js";

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
            let name = _user.name;
            let email = _user.email;
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
  },
};
