import { ApolloError, UserInputError } from "apollo-server-express";
import { Payment } from "../../models/payment.js";
import { Order } from "../../models/order.js";
import { uploadProcess } from "../../helpers/image.js";
import { isAuthenticate } from "../../helpers/user.js";

import axios from "axios";
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

    async getPaymentMethods() {
      const payments = await Payment.find({ hidden: true });
      if (!payments.length) throw new Error("Nebyli nalezené způsoby platby");
      return [...payments];
    },

    async getAllPaymentMethods(_, { limit = 10, skip = 1 }, { user }) {
      isAuthenticate(user);

      const page = (skip - 1) * limit;

      // get the number of payment methods
      const count = await Payment.find({}).countDocuments();
      const pages = Math.ceil(count / limit);

      // get payments
      const payments = count
        ? await Payment.find({}).skip(page).limit(limit)
        : [];
      return { methods: payments, pages: pages };
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
      const newPayment = new Payment({ ...payment, image: img });

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
      if (image) {
        img = await uploadProcess(image, "payment/");
        update = { ...payment, image: img };
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
            success_url: `${process.env.FRONTEND_URL}/checkout/success`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/pay-for-it?order=${_order.orderNumber}`,
          });
          return { url: session.url };
        } catch (e) {
          console.log(e);
          throw new ApolloError("Něco se nezdařilo");
        }
      }

      throw new ApolloError("Neplatná objednávka");
    },

    async createPayPalPayment(_, { orderNumber }) {
      //check orderNumber:
      if (!orderNumber) {
        throw new UserInputError("Invalid argument value");
      }
      // get order
      const _order = await Order.findOne({ orderNumber: orderNumber });
      // if there is an order - create a paypal payment
      if (_order) {
        try {
          // create order
          const order = {
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: `${_order.token}`,
                amount: {
                  currency_code: "CZK",
                  value: `${_order.total_price}`,
                },
              },
            ],
            application_context: {
              brand_name: "BigBuy.cz",
              landing_page: "NO_PREFERENCE",
              user_action: "PAY_NOW",
              return_url: `${process.env.BACKEND_URL}/capture-order`,
              cancel_url: `${process.env.FRONTEND_URL}/checkout/pay-for-it?order=${_order.orderNumber}`,
            },
          };

          // format the body
          const params = new URLSearchParams();
          params.append("grant_type", "client_credentials");

          // Generate an access token
          const {
            data: { access_token },
          } = await axios.post(
            `${process.env.PAYPAL_API}/v1/oauth2/token`,
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              auth: {
                username: process.env.PAYPAL_CLIENT_KEY,
                password: process.env.PAYPAL_SECRET_KEY,
              },
            }
          );

          // make a request
          const data = await axios
            .post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            })
            .then((res) => res.data);

          // return url link
          return { url: data.links[1].href };
        } catch (e) {
          console.log(e);
          throw new ApolloError("Něco se nezdařilo");
        }
      }

      throw new ApolloError("Neplatná objednávka");
    },
  },
};
