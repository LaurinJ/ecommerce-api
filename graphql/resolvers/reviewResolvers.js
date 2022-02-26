import { AdminChatToken } from "../../models/adminChatToken.js";
import { Review } from "../../models/review.js";
import { withFilter } from "graphql-subscriptions";
import { PubSub } from "graphql-subscriptions";
import { contactMessageValidator } from "../../validators/contactMessage.js";
import { isAuthenticate } from "../../helpers/user.js";

export const reviewResolvers = {
  Query: {
    async getReviews(_, { limit = 10, skip = 1, product_id }) {
      const page = (skip - 1) * limit;
      if (product_id) {
        const count = await Review.find({
          product: product_id,
        }).countDocuments();
        const pages = Math.ceil(count / 10);

        const _reviews = count
          ? await Review.find({ product: product_id })
              .populate("user")
              .sort("-createdAt")
              .skip(page)
              .limit(limit)
          : [];
        return { reviews: _reviews, pages: pages };
      }
      return { reviews: [], pages: 0 };
    },
  },
  Mutation: {
    async createReview(_, { review }, { user }) {
      isAuthenticate(user);
      const newReview = new Review({ ...review, user: user._id });

      const data = await newReview.save();
      return { ...data._doc, user: { name: user.name } };
    },
  },
};
