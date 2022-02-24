import { UserInputError } from "apollo-server-express";
import { AdminChatToken } from "../../models/adminChatToken.js";
import { Review } from "../../models/review.js";
import { ContactMessage } from "../../models/contactMessage.js";
import { withFilter } from "graphql-subscriptions";
import { PubSub } from "graphql-subscriptions";
import { contactMessageValidator } from "../../validators/contactMessage.js";

export const reviewResolvers = {
  Query: {
    async getMessages(_, { id }) {
      if (id) {
        const _messages = Message.find({
          $or: [{ to: id }, { from: id }],
        });
        return _messages;
      }
      return [];
    },
  },
  Mutation: {
    async createReview(_, { review }, { user }) {
      console.log(user);
      //   const newReview = new Review({ ...review });

      //   const data = await newReview.save();
      //   return data._doc;
      return review;
    },
  },
};
