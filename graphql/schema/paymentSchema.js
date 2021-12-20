export const typeDefs = `
  input PaymentData {
    _id: ID
    name: String
    hidden: Boolean
  }

  type Payment {
      _id: ID
      name: String!
      image: String
      hidden: Boolean
  }

  type Query {
    getPaymentMethod: [Payment]!
  }

  type Mutation {
    createPayment(payment: PaymentData!, image: Upload): Payment!
  }
`;
