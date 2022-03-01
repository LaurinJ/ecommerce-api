import { UserInputError } from "apollo-server-express";
import { Payment } from "../../models/payment.js";
import { Order } from "../../models/order.js";
import { uploadProcess } from "../../helpers/image.js";

import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRAPI_PRIVATE_KEY);

export const paymentResolvers = {
  Query: {
    async getPaymentMethod(_, { id }) {
      const payment = await Payment.findOne({ _id: id });
      if (!payment) {
        throw new Error("Neplatné id");
      }
      return payment;
    },
    async getPaymentMethods(_, { limit = 10, skip = 0 }) {
      const page = skip <= 1 ? 0 : skip * limit - 10;
      const payments = await Payment.find({}).skip(page).limit(limit);
      if (payments.length === 0) {
        throw new Error("Nebyli nalezené způsoby platby");
      }
      return [...payments];
    },
  },
  Mutation: {
    async createPayment(_, { payment, image }) {
      if (!payment.name || !payment.name.length) {
        throw new UserInputError("Invalid argument value", {
          errors: { name: "Toto pole je povinné" },
        });
      }

      let img;
      if (image) {
        img = await uploadProcess(image, "payment/");
      }
      delete payment._id;
      const newPayment = new Payment({ ...payment, image: img?._path });

      const data = await newPayment.save();

      return data._doc;
    },
    async editPayment(_, { payment, image }) {
      //check payment data:
      if (!payment.name || !payment.name.length) {
        throw new UserInputError("Invalid argument value", {
          errors: { name: "Toto pole je povinné" },
        });
      }
      let update = { ...payment };
      let img;
      if (image && !image.length) {
        img = await uploadProcess(image, "deliver/");
        update = { ...payment, image: img?._path };
      }
      const _payment = await Payment.findOneAndUpdate(
        { _id: payment._id },
        update
      );

      return _payment._doc;
    },
    async createStripePayment(_, { orderNumber }) {
      //check orderNumber:
      if (!orderNumber) {
        throw new UserInputError("Invalid argument value");
      }
      const _order = await Order.findOne({ orderNumber: orderNumber });
      // console.log(_order);
      try {
        const stripe = new Stripe(
          "sk_test_51KYdQtJcQ5HN8MiYerULIm8ppK9BFBBj65TmVzi8b8fcBuyaNWQMNaTczICAEls7p0JeU89CUqxshCAJFy43r0Ax00FI3kU9lu"
        );
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: _order.items.map((item) => {
            return {
              price_data: {
                // currency: "czk",
                currency: "usd",
                product_data: {
                  name: item.title,
                },
                unit_amount: item.price,
              },
              quantity: item.count,
            };
          }),
          success_url: `http://localhost:3000/checkout/pay-for-it?order=1646169703862`,
          cancel_url: `http://localhost:3000/checkout/pay-for-it?order=1646169703862`,
        });
        return session.url;
      } catch (e) {
        // res.status(500).json({ error: e.message });
        console.log(e);
      }

      // console.log(process.env.STRIPE_PRIVATE_KEY);
      return "_payment._doc";
    },
  },
};
