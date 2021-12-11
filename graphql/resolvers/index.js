// const productResolvers = require("./product");
// const userResolvers = require("./user");
// const orderResolvers = require("./order");

import { productResolvers } from "./product.js";
import { userResolvers } from "./user.js";
import { orderResolvers } from "./order.js";

export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...userResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...userResolvers.Mutation,
    ...orderResolvers.Mutation,
  },
};
