import mongoose from "mongoose";
import crypto from "crypto";
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    person: {
      type: ObjectId,
      ref: "Person",
      required: true,
    },
    items: [],
    total_price: {
      type: Number,
      trim: true,
      // required: true,
    },
    payment_method: {
      type: ObjectId,
      ref: "Payment",
      // required: true,
    },
    paid_at: {
      type: Date,
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
    delivered_at: {
      type: Date,
    },
    is_deliver: {
      type: Boolean,
      default: false,
    },
    deliver_method: {
      type: ObjectId,
      ref: "Deliver",
      // required: true,
    },
    state: {
      type: String,
      enum: [
        "unfinished",
        "created",
        "completed",
        "accepted",
        "sent",
        "suspended",
        "canceled",
      ],
      default: "unfinished",
    },
    token: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

orderSchema.pre("validate", async function (next) {
  try {
    let token = await crypto.createHmac("sha256", "key321").digest("hex"); // generate token
    this.token = token;
  } catch (error) {
    console.error(error);
  }
  return next();
});

export const Order = mongoose.model("Order", orderSchema);
