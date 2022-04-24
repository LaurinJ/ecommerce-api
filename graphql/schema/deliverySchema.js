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

  type DeliveryMethods {
    methods: [Delivery]!
    pages: Int!
}  

  type Query {
    getDeliveryMethod(id: String): Delivery
    getDeliveryMethods: [Delivery]!
    getAllDeliveryMethods(limit: Int, skip: Int): DeliveryMethods!
  }

  type Mutation {
    createDeliveryMethod(delivery: DeliveryData!, image: Upload): Delivery!
    editDeliveryMethod(delivery: DeliveryData!, image: Upload): Delivery!
    deleteDeliveryMethod(id: String): Delivery!
  }
`;
