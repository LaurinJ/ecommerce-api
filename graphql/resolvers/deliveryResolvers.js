import { UserInputError } from "apollo-server-express";
import { Deliver } from "../../models/deliver.js";
import { deliverValidator } from "../../validators/deliver.js";
import { uploadProcess } from "../../helpers/image.js";

export const deliveryResolvers = {
  Query: {
    async getDeliveryMethod(_, { id }) {
      const delivery = await Deliver.findOne({ _id: id });
      if (!delivery) {
        throw new Error("Neplatné id");
      }
      return delivery;
    },

    async getDeliveryMethods(_, { limit = 10, skip = 0 }) {
      const page = skip <= 1 ? 0 : skip * limit - 10;
      const delivers = await Deliver.find({ hidden: true })
        .skip(page)
        .limit(limit);
      if (!delivers.length) {
        throw new Error("Nebyli nalezené způsoby dopravy");
      }
      return [...delivers];
    },
  },
  Mutation: {
    async createDeliveryMethod(_, { delivery, image }) {
      //check deliver data
      const deliveryErrors = deliverValidator(delivery);
      if (Object.keys(deliveryErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: { ...deliveryErrors },
        });
      }
      let img;
      if (image) {
        img = await uploadProcess(image, "deliver/");
      }
      delete delivery._id;
      const newDelivery = new Deliver({ ...delivery, image: img?._path });

      const data = await newDelivery.save();

      return data._doc;
    },
    async editDeliveryMethod(_, { delivery, image }) {
      //check deliver data:
      const deliveryErrors = deliverValidator(delivery);
      if (Object.keys(deliveryErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: { ...deliveryErrors },
        });
      }
      let update = { ...delivery };
      let img;
      if (image && !image.length) {
        img = await uploadProcess(image, "deliver/");
        update = { ...delivery, image: img?._path };
      }
      const _delivery = await Deliver.findOneAndUpdate(
        { _id: delivery._id },
        update
      );

      return _delivery._doc;
    },
  },
};
