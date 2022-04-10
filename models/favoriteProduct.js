import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const favoriteProductSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      require: true,
    },
    product: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
  },

  { timestamps: true }
);

export const FavoriteProduct = mongoose.model(
  "FavoriteProduct",
  favoriteProductSchema
);
