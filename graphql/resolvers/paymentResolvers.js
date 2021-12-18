import { UserInputError } from "apollo-server-express";
import { Payment } from "../../models/payment.js";
import { uploadProcess } from "../../helpers/image.js";

export const paymentResolvers = {
  Query: {
    async getPaymentMethod(_, { limit = 10, skip = 0 }) {
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

      const newPayment = new Payment({ ...payment, image: img?._path });

      const data = await newPayment.save();

      return data._doc;
    },
  },
};
