import { productResolvers } from "./productResolvers.js";
import { userResolvers } from "./userResolvers.js";
import { orderResolvers } from "./orderResolvers.js";
import { paymentResolvers } from "./paymentResolvers.js";
import { deliverResolvers } from "./deliverResolvers.js";

export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...userResolvers.Query,
    ...orderResolvers.Query,
    ...paymentResolvers.Query,
    ...deliverResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...paymentResolvers.Mutation,
    ...deliverResolvers.Mutation,
  },
};
