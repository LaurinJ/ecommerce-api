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
    getDeliveryMethod: [Delivery]!
  }

  type Mutation {
    createDeliveryMethod(delivery: DeliveryData!, image: Upload): Delivery!
  }
`;
