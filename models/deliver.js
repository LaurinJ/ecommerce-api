import mongoose from "mongoose";

const deliverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const Deliver = mongoose.model("Deliver", deliverSchema);
