const mongoose = require("mongoose");

const personDetailSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      max: 100,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("PersonDetail", personDetailSchema);
