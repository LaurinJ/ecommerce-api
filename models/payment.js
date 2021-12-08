const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
    hidden: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
