import {
  ApolloError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminChatToken } from "../../models/adminChatToken.js";
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
    async getAdminToken() {
      const adminToken = AdminChatToken.findOne({});
      return adminToken;
    },
  },
  Mutation: {
    async sendMessage(_, { message }) {
      const newMessage = new Message({ ...message });

      const data = await newMessage.save();
      pubsub.publish("SHARE_MESSAGE", { shareMessage: data });
      return data._doc;
    },
    async setAdminToken(_, { token }) {
      if (token) {
        const adminToken = new AdminChatToken({ token: token });
        const data = await adminToken.save();
        pubsub.publish("ADMIN_ONLINE", { adminOnline: data });
        return data;
      }
      throw new UserInputError("Neplatný token!");
    },
    async deleteAdminToken(_, { token }) {
      if (token) {
        const adminToken = AdminChatToken.findOneAndDelete({ token: token });
        pubsub.publish("ADMIN_ONLINE", { adminOnline: null });
        return adminToken;
      }
      throw new UserInputError("Neplatný token!");
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
    adminOnline: {
      subscribe: () => pubsub.asyncIterator(["ADMIN_ONLINE"]),
    },
  },
};
