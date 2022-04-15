import express from "express";
import { captureOrder } from "../controllers/paypal.js";
import { stripeWebhook } from "../controllers/stripe.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.get("/capture-order", captureOrder);

export { router };
