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

  type PaymentMethods {
    methods: [Payment]!
    pages: Int!
}

  type Url {
    url: String
  }

  type Query {
    getPaymentMethod(id: String): Payment
    getPaymentMethods: [Payment]!
    getAllPaymentMethods(limit: Int, skip: Int): PaymentMethods!
  }

  type Mutation {
    createPayment(payment: PaymentData!, image: Upload): Payment!
    editPayment(payment: PaymentData!, image: Upload): Payment!
    deletePayment(id: String): Payment!
    createStripePayment(orderNumber: String): Url!
    createPayPalPayment(orderNumber: String): Url!
  }
`;
