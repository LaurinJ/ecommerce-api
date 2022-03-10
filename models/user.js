// import { Schema, model } from "mongoose";
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Token = require("./token");

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "./token.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      max: 255,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamp: true }
);

userSchema.methods = {
  createAccessToken: async function () {
    try {
      let { _id, name, role } = this;
      let accessToken = jwt.sign(
        { user: { _id, name, role } },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return accessToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      let { _id, name, role } = this;
      let refreshToken = jwt.sign(
        { user: { _id, name, role } },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  changePassword: async function (password) {
    try {
      console.log(this.password);
      let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
      let hashedPassword = await bcrypt.hash(password, salt); // hash the new user's password
      this.password = hashedPassword;
      console.log(this.password);
      // await this.save();
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

userSchema.pre("save", async function (next) {
  try {
    let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
    let hashedPassword = await bcrypt.hash(this.password, salt); // hash the current user's password
    this.password = hashedPassword;
  } catch (error) {
    console.error(error);
  }
  return next();
});

export const User = mongoose.model("User", userSchema);
