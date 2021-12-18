import { UserInputError } from "apollo-server-express";
import { Deliver } from "../../models/deliver.js";
import { deliverValidator } from "../../validators/deliver.js";
import { uploadProcess } from "../../helpers/image.js";

export const deliverResolvers = {
  Query: {
    async getDeliverMethod(_, { limit = 10, skip = 0 }) {
      const page = skip <= 1 ? 0 : skip * limit - 10;
      const delivers = await Deliver.find({}).skip(page).limit(limit);
      if (delivers.length === 0) {
        throw new Error("Nebyli nalezené způsoby dopravy");
      }
      return [...delivers];
    },
  },
  Mutation: {
    async createDeliverMethod(_, { deliver, image }) {
      //check deliver data:
      const deliverErrors = deliverValidator(deliver);
      if (Object.keys(deliverErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: { ...deliverErrors },
        });
      }
      let img;
      if (image) {
        img = await uploadProcess(image, "deliver/");
      }

      const newDeliver = new Deliver({ ...deliver, image: img?._path });

      const data = await newDeliver.save();

      return data._doc;
    },
  },
};
