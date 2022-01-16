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
    getPaymentMethod(id: String): Payment
    getPaymentMethods(limit: Int, skip: Int): [Payment]!
  }

  type Mutation {
    createPayment(payment: PaymentData!, image: Upload): Payment!
    editPayment(payment: PaymentData!, image: Upload): Payment!
  }
`;
