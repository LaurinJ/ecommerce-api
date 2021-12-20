import { UserInputError } from "apollo-server-express";
import { Deliver } from "../../models/deliver.js";
import { deliverValidator } from "../../validators/deliver.js";
import { uploadProcess } from "../../helpers/image.js";

export const deliveryResolvers = {
  Query: {
    async getDeliveryMethod(_, { limit = 10, skip = 0 }) {
      const page = skip <= 1 ? 0 : skip * limit - 10;
      const delivers = await Deliver.find({}).skip(page).limit(limit);
      if (delivers.length === 0) {
        throw new Error("Nebyli nalezené způsoby dopravy");
      }
      return [...delivers];
    },
  },
  Mutation: {
    async createDeliveryMethod(_, { delivery, image }) {
      //check deliver data:
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

      const newDelivery = new Deliver({ ...delivery, image: img?._path });

      const data = await newDelivery.save();

      return data._doc;
    },
  },
};
