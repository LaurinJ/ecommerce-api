export const typeDefs = `
  input DeliveryData {
    _id: ID
    name: String
    price: Int
    hidden: Boolean
  }

  type Delivery {
      _id: ID
      name: String!
      image: String
      price: Int!
      hidden: Boolean
  }

  type Query {
    getDeliveryMethod(id: String): Delivery
    getDeliveryMethods(limit: Int, skip: Int): [Delivery]!
  }

  type Mutation {
    createDeliveryMethod(delivery: DeliveryData!, image: Upload): Delivery!
    editDeliveryMethod(delivery: DeliveryData!, image: Upload): Delivery!
  }
`;
