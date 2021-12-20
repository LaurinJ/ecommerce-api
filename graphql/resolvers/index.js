import { productResolvers } from "./productResolvers.js";
import { userResolvers } from "./userResolvers.js";
import { orderResolvers } from "./orderResolvers.js";
import { paymentResolvers } from "./paymentResolvers.js";
import { deliveryResolvers } from "./deliveryResolvers.js";

export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...userResolvers.Query,
    ...orderResolvers.Query,
    ...paymentResolvers.Query,
    ...deliveryResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...paymentResolvers.Mutation,
    ...deliveryResolvers.Mutation,
  },
};
