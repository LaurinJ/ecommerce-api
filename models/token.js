import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String },
});

export const Token = mongoose.model("Token", tokenSchema);
