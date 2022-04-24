import { UserInputError } from "apollo-server-express";
import { Deliver } from "../../models/deliver.js";
import { deliverValidator } from "../../validators/deliver.js";
import { uploadProcess } from "../../helpers/image.js";
import { isAdmin } from "../../helpers/user.js";

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
      isAdmin(user);

      const page = (skip - 1) * limit;

      // get the number of delivery methods
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
    async createDeliveryMethod(_, { delivery, image }, { user }) {
      isAdmin(user);

      //check delivery data
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
      const newDelivery = new Deliver({ ...delivery, image: img });

      const data = await newDelivery.save();

      return data._doc;
    },

    async editDeliveryMethod(_, { delivery, image }, { user }) {
      isAdmin(user);

      //check delivery data:
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
        update = { ...delivery, image: img };
      }
      const _delivery = await Deliver.findOneAndUpdate(
        { _id: delivery._id },
        update
      );

      return _delivery._doc;
    },

    async deleteDeliveryMethod(_, { id }, { user }) {
      isAdmin(user);

      // check delivery id:
      if (!id) throw new UserInputError("Neplatné id!");

      const _delivery = await Deliver.findByIdAndDelete(id);

      if (!_delivery) throw new ApolloError("Něco se pokazilo!");

      return _delivery._doc;
    },
  },
};
