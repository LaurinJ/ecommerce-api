import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "Product", required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    content: {
      type: String,
      trim: true,
      max: 3000,
      required: true,
    },
    rating: { type: Number },
    hidden: {
      type: Number,
      default: false,
    },
  },

  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
