const productResolvers = require("./product");

module.exports = {
  Query: { ...productResolvers.Query },
  Mutation: { ...productResolvers.Mutation },
};
