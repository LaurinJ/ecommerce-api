import mongoose from "mongoose";

const adminChatTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      trim: true,
      required: true,
    },
  },

  { timestamps: true }
);

export const AdminChatToken = mongoose.model(
  "AdminChatToken",
  adminChatTokenSchema
);
