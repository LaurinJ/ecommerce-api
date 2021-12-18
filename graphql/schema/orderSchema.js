export const typeDefs = `
  input AddressData {
    village: String!
    street: String!
    postCode: Int!
    numberDescriptive: Int!
  }

  input PersonData {
    email: String!
    first_name: String!
    last_name: String!
    phone: Int!
  }

  input PaymentMethod {
    _id: ID!
  }

  input DeliveryMethod {
    _id: ID!
  }

  type PersonToken {
    token: String!
  }

  input PersonTokenData {
    token: String!
  }

  input CartData {
    _id: ID
    title: String
    short_description: String
    code: String
    price: Int!
    old_price: Int
    quantity: Int
    imgurl: String
  }

  input OrderData {
    items: [CartData]!
    total_price: Int
    total_qty: Int
    payment_method: ID
    deliver_method: ID

  }

  type Mutation {
    personAdress(person: PersonData, address: AddressData): PersonToken!
    createOrder(order: OrderData, token: PersonTokenData!): Message
  }
`;
