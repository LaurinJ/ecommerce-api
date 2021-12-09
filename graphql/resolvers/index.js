const productResolvers = require("./product");
const userResolvers = require("./user");
const orderResolvers = require("./order");

module.exports = {
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
