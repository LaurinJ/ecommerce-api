export const typeDefs = `
  input DeliverData {
    name: String!
    price: Int
    hidden: Boolean!
  }

  type Deliver {
      _id: ID
      name: String!
      image: String
      price: Int!
      hidden: Boolean
  }

  type Query {
    getDeliverMethod: [Deliver]!
  }

  type Mutation {
    createDeliverMethod(deliver: DeliverData!, image: Upload): Deliver!
  }
`;
