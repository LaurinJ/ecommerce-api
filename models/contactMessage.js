import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const contactMessageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    answer: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);
