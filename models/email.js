import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
  },

  { timestamps: true }
);

export const Email = mongoose.model("Email", emailSchema);
