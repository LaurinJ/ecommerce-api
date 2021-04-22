const mongoose = require("mongoose");
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
    code: {
      type: Number,
    },
    price: {
      type: Number,
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
    categories: [{ type: ObjectId, ref: "Category", required: true }],
    hidden: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
