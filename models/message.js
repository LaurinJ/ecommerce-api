import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      trim: true,
      required: true,
    },
    to: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },

  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
