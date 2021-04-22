const mongoose = require("mongoose");

const categotySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      max: 32,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Category", categotySchema);
