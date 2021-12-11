import mongoose from "mongoose";
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
      max: 100,
      required: true,
    },
    payment_method: {
      type: ObjectId,
      ref: "Payment",
      required: true,
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
      required: true,
    },
    state: {
      type: String,
      enum: [
        "created",
        "completed",
        "accepted",
        "sent",
        "suspended",
        "canceled",
      ],
      default: "created",
    },
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
