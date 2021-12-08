const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema(
  {
    village: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
    street: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
    numberDescriptive: {
      type: Number,
      required: true,
    },
    postCode: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
