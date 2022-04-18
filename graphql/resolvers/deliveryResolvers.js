import { UserInputError } from "apollo-server-express";
import { Deliver } from "../../models/deliver.js";
import { deliverValidator } from "../../validators/deliver.js";
import { uploadProcess } from "../../helpers/image.js";
import { isAuthenticate } from "../../helpers/user.js";

export const deliveryResolvers = {
  Query: {
    async getDeliveryMethod(_, { id }) {
      const delivery = await Deliver.findOne({ _id: id });
      if (!delivery) {
        throw new Error("Neplatné id");
      }
      return delivery;
    },

    async getDeliveryMethods() {
      const delivers = await Deliver.find({ hidden: true });
      if (!delivers.length) throw new Error("Nebyli nalezené způsoby dopravy");
      return [...delivers];
    },

    async getAllDeliveryMethods(_, { limit = 10, skip = 1 }, { user }) {
      isAuthenticate(user);

      const page = (skip - 1) * limit;

      // get the number of delivery method
      const count = await Deliver.find({}).countDocuments();
      const pages = Math.ceil(count / limit);

      // get delivery
      const delivery = count
        ? await Deliver.find({}).skip(page).limit(limit)
        : [];
      return { methods: delivery, pages: pages };
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
