import { ApolloError, UserInputError } from "apollo-server-express";
import { AdminChatToken } from "../../models/adminChatToken.js";
import { Message } from "../../models/message.js";
import { ContactMessage } from "../../models/contactMessage.js";
import { withFilter } from "graphql-subscriptions";
import { PubSub } from "graphql-subscriptions";
import { contactMessageValidator } from "../../validators/contactMessage.js";
import { contactMessageEmail } from "../../helpers/email.js";
import { isAdmin } from "../../helpers/user.js";

export const pubsub = new PubSub();

export const chatResolvers = {
  Query: {
    async getMessages(_, { id }) {
      if (id) {
        const _messages = Message.find({
          $or: [{ to: id }, { from: id }],
        });
        // .sort("-createdAt")
        // .limit(20);
        return _messages;
      }
      return [];
    },

    async getAdminToken() {
      const adminToken = AdminChatToken.findOne({});
      return adminToken;
    },

    async getContactMessages(_, { limit = 12, skip = 1 }, { user }) {
      isAdmin(user);

      const page = (skip - 1) * limit;
      const count = await ContactMessage.find({}).countDocuments();
      const pages = Math.ceil(count / limit);

      const messages = count
        ? await ContactMessage.find({})
            .sort("-createdAt")
            .skip(page)
            .limit(limit)
        : [];
      return { messages: messages, pages: pages };
    },

    async getContactMessage(_, { id }, { user }) {
      isAdmin(user);

      if (!id) throw new UserInputError("Tato zpráva neexistuje!");
      const message = await ContactMessage.findOne({ _id: id });
      if (!message) throw new UserInputError("Tato zpráva neexistuje!");
      return message;
    },

    async getContactMessagesCount(_, __, { user }) {
      isAdmin(user);
      const count = await ContactMessage.find({ read: false }).countDocuments();
      return { messages: count || 0 };
    },
  },
  Mutation: {
    async sendMessage(_, { message }) {
      const newMessage = new Message({ ...message });

      const data = await newMessage.save();
      pubsub.publish("SHARE_MESSAGE", { shareMessage: data });
      return data._doc;
    },

    async setAdminToken(_, { token }, { user }) {
      isAdmin(user);

      if (token) {
        const adminToken = new AdminChatToken({ token: token });
        const data = await adminToken.save();
        pubsub.publish("ADMIN_ONLINE", { adminOnline: data });
        return data;
      }
      throw new UserInputError("Neplatný token!");
    },

    async deleteAdminToken(_, { token }, { user }) {
      isAdmin(user);

      if (token) {
        const adminToken = AdminChatToken.findOneAndDelete({ token: token });
        pubsub.publish("ADMIN_ONLINE", { adminOnline: null });
        return adminToken;
      }
      throw new UserInputError("Neplatný token!");
    },

    async sendContactMessage(_, { message }) {
      //check contact data
      const messageErrors = contactMessageValidator(message);
      if (Object.keys(messageErrors).length !== 0) {
        throw new UserInputError("Invalid argument value", {
          errors: messageErrors,
        });
      }
      const _message = new ContactMessage(message);
      const data = await _message.save();
      return data._doc;
    },

    async answerContactMessage(_, { id, message }, { user }) {
      isAdmin(user);

      //check contact data
      const messageErrors = contactMessageValidator(message);
      if (Object.keys(messageErrors).length !== 0 && id) {
        throw new UserInputError("Invalid argument value", {
          errors: messageErrors,
        });
      }

      let _message = await ContactMessage.findById(id);
      if (_message) {
        _message.answer = true;
        _message.save();
        contactMessageEmail(message.email, message.content);
      }
      return { message: "Updated" };
    },

    async readContactMessage(_, { id }, { user }) {
      isAdmin(user);

      let message = await ContactMessage.findById(id);
      if (message) {
        message.read = true;
        message.save();
      }
      return { message: "Updated" };
    },

    async deleteContactMessage(_, { id }, { user }) {
      isAdmin(user);

      // check contact id:
      if (!id) throw new UserInputError("Neplatné id!");

      const _message = await ContactMessage.findByIdAndDelete(id);

      if (!_message) throw new ApolloError("Něco se pokazilo!");

      return _message._doc;
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
