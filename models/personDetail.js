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
    phone: {
      type: Number,
      trim: true,
      max: 13,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("PersonDetail", personDetailSchema);
