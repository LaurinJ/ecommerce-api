import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "./token.js";
import { Profile } from "./profile.js";

const { ObjectId } = mongoose.Schema;

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
      default: 1,
    },
    profile: {
      type: ObjectId,
      ref: "Profile",
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
  generatePassword: async function () {
    try {
      let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
      let hashedPassword = await bcrypt.hash(this.password, salt); // hash the current user's password
      this.password = hashedPassword;
    } catch (error) {
      console.error(error);
    }
  },
  changePassword: async function (password) {
    try {
      let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
      let hashedPassword = await bcrypt.hash(password, salt); // hash the new user's password
      this.password = hashedPassword;
      await this.save();
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createProfile: async function () {
    try {
      const profile = await new Profile().save();
      this.profile = profile._id;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

export const User = mongoose.model("User", userSchema);
