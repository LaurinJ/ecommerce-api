import { ApolloError, UserInputError } from "apollo-server-express";
import { Payment } from "../../models/payment.js";
import { Order } from "../../models/order.js";
import { uploadProcess } from "../../helpers/image.js";

import Stripe from "stripe";

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
      const payments = await Payment.find({ hidden: false })
        .skip(page)
        .limit(limit);
      if (payments.length) {
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
      // get order
      const _order = await Order.findOne({ orderNumber: orderNumber });
      // if there is an order - create a stripe payment
      if (_order) {
        try {
          const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            client_reference_id: _order.token,
            line_items: _order.items.map((item) => {
              return {
                price_data: {
                  currency: "czk",
                  product_data: {
                    name: item.title,
                  },
                  unit_amount: item.price * 100,
                },
                quantity: item.count,
              };
            }),
            success_url: `http://localhost:3000/checkout/success`,
            cancel_url: `http://localhost:3000/checkout/pay-for-it?order=1646169703862`,
          });
          return { url: session.url };
        } catch (e) {
          console.log(e);
          throw new ApolloError("Něco se nezdařilo");
        }
      }

      throw new ApolloError("Neplatná objednávka");
    },
  },
};
