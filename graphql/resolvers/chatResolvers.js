import {
  ApolloError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
import { Message } from "../../models/message.js";

import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const chatResolvers = {
  Query: {
    async getMessages(_, { id }) {
      console.log(id);
      if (id) {
        const _messages = Message.where(
          `this.from === ${id} || this.to === ${id}`
        ).sort("-createdAt");
        return _messages;
      }
      return [];
    },
  },
  Mutation: {
    async sendMessage(_, { message }) {
      const newMessage = new Message({ ...message });

      const data = await newMessage.save();

      return data._doc;
    },
  },
  Subscription: {
    userReg: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(["USER_REG"]),
    },
  },
};
