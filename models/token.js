const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  token: { type: String },
});

module.exports = mongoose.model("Token", tokenSchema);
