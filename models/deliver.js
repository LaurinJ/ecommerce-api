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
      max: 100,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const Deliver = mongoose.model("Deliver", deliverSchema);
