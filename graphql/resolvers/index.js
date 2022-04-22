import { productResolvers } from "./productResolvers.js";
import { userResolvers } from "./userResolvers.js";
import { orderResolvers } from "./orderResolvers.js";
import { paymentResolvers } from "./paymentResolvers.js";
import { deliveryResolvers } from "./deliveryResolvers.js";
import { chatResolvers } from "./chatResolvers.js";
import { categoryResolvers } from "./categoryResolvers.js";
import { reviewResolvers } from "./reviewResolvers.js";

export const resolvers = {
  EditProfile: { ...userResolvers.EditProfile },
  Query: {
    ...productResolvers.Query,
    ...userResolvers.Query,
    ...orderResolvers.Query,
    ...paymentResolvers.Query,
    ...deliveryResolvers.Query,
    ...chatResolvers.Query,
    ...categoryResolvers.Query,
    ...reviewResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...paymentResolvers.Mutation,
    ...deliveryResolvers.Mutation,
    ...chatResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...reviewResolvers.Mutation,
  },
  Subscription: {
    ...chatResolvers.Subscription,
  },
};
