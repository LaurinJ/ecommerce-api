import express from "express";
import Stripe from "stripe";
import { Order } from "../models/order.js";
import { Person } from "../models/person.js";
import { paidOrderEmail } from "../helpers/email.js";
import { createInvoice } from "../helpers/invoice.js";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

const endpointSecret =
  "whsec_d0124fac0988f50065bcb40336a6dbec2ef36d28d79b00ddc684c2a374030102";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async function (req, res) {
    let event;
    console.log("sig");
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
        // get order
        if (event.type === "checkout.session.completed") {
          const _order = await Order.findOne({
            token: event.data.object.client_reference_id,
          }).populate("deliver_method");
          // if there is an order - order update
          if (_order) {
            _order.is_paid = true;
            _order.paid_at = new Date();
            _order.save();

            let _person = await Person.findById(_order.person).populate(
              "person_detail address"
            );
            createInvoice(_order, _person, _order.orderNumber);
            paidOrderEmail(_person.person_detail.email, _order.orderNumber);
          }
        }
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }

    return res.sendStatus(200);
  }
);

export { router };
