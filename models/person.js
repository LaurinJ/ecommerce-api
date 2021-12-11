import mongoose from "mongoose";
import crypto from "crypto";
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
    token: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

personSchema.pre("validate", async function (next) {
  try {
    let token = await crypto.createHmac("sha256", "key321").digest("hex"); // generate token
    this.token = token;
  } catch (error) {
    console.error(error);
  }
  return next();
});

export const Person = mongoose.model("Person", personSchema);
