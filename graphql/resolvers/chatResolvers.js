import {
  ApolloError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
import { Message } from "../../models/message.js";
import { withFilter } from "graphql-subscriptions";
import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const chatResolvers = {
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
    async sendMessage(_, { message }) {
      // console.log(c);
      const newMessage = new Message({ ...message });

      const data = await newMessage.save();
      pubsub.publish("SHARE_MESSAGE", { shareMessage: data });
      return data._doc;
    },
  },
  Subscription: {
    shareMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["SHARE_MESSAGE"]),
        ({ shareMessage }, _, { chatid }) => {
          if (shareMessage.to === chatid || shareMessage.from === chatid) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
