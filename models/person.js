import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const personSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      default: null,
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

export const Person = mongoose.model("Person", personSchema);
