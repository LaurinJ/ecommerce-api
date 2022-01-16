import { UserInputError } from "apollo-server-express";
import { Payment } from "../../models/payment.js";
import { uploadProcess } from "../../helpers/image.js";

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
  },
};
