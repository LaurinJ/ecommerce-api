const productResolvers = require("./product");
const userResolvers = require("./user");

module.exports = {
  Query: { ...productResolvers.Query, ...userResolvers.Query },
  Mutation: { ...productResolvers.Mutation, ...userResolvers.Mutation },
};
