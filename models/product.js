import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: {},
      required: true,
      min: 100,
      max: 2000000,
    },
    short_description: {
      type: String,
      max: 1000,
    },
    imgurl: { type: String, trim: true, max: 1000, required: true },
    images: [],
    code: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    old_price: {
      type: Number,
    },
    rating_sum: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    countInStock: { type: Number, default: 0, require: true },
    categories: [{ type: ObjectId, ref: "Category", required: true }],
    hidden: {
      type: Number,
      default: false,
    },
  },

  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
