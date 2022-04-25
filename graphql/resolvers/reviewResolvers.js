import { Review } from "../../models/review.js";
import { isAuthenticate } from "../../helpers/user.js";

export const reviewResolvers = {
  Query: {
    async getReviews(_, { limit = 10, skip = 1, product_id }) {
      const page = (skip - 1) * limit;
      if (product_id) {
        const count = await Review.find({
          product: product_id,
          hidden: true,
        }).countDocuments();
        const pages = Math.ceil(count / limit);

        const _reviews = count
          ? await Review.find({ product: product_id, hidden: true })
              .populate("user")
              .sort("-createdAt")
              .skip(page)
              .limit(limit)
          : [];
        return { reviews: _reviews, pages: pages };
      }
      return { reviews: [], pages: 0 };
    },

    async getUserReviews(_, { limit = 10, skip = 1 }, { user }) {
      isAuthenticate(user);
      const page = (skip - 1) * limit;
      const count = await Review.find({
        user: user._id,
        hidden: true,
      }).countDocuments();
      const pages = Math.ceil(count / limit);

      const _reviews = count
        ? await Review.find({ user: user._id, hidden: true })
            .populate("product")
            .sort("-createdAt")
            .skip(page)
            .limit(limit)
        : [];
      return { reviews: _reviews, pages: pages };
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
