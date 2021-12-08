const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const personSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    person_detail: {
      type: ObjectId,
      ref: "PersonDetail",
    },
    address: {
      type: ObjectId,
      ref: "Address",
      required: true,
    },
    delivery_adress: {
      type: ObjectId,
      ref: "Address",
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);
