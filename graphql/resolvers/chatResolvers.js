import {
  ApolloError,
  UserInputError,
  ValidationError,
} from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
import { Token } from "../../models/token.js";

import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const chatResolvers = {
  Query: {},
  Mutation: {},
  Subscription: {
    userReg: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(["USER_REG"]),
    },
  },
};
