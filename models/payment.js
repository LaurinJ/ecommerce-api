import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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
      max: 100,
      required: true,
    },
    img: {
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

export const Payment = mongoose.model("Payment", paymentSchema);
