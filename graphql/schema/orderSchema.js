export const typeDefs = `
  input AddressData {
    village: String!
    street: String!
    postCode: Int!
    numberDescriptive: Int!
  }

  type Address {
    village: String
    street: String
    postCode: Int
    numberDescriptive: Int
  }

  input PersonData {
    email: String!
    first_name: String!
    last_name: String!
    phone: Int!
  }  

  type PersonDetail {
    email: String
    first_name: String
    last_name: String
    phone: Int
  }

  type Person {
    person_detail: PersonDetail
    address: Address
  }

  type OrderToken {
    token: String!
  }

  input OrderTokenData {
    token: String!
  }

  input CartData {
    _id: ID
    title: String
    short_description: String
    price: Int!
    old_price: Int
    count: Int
    img: String
  }

  type Cart {
    _id: ID
    title: String
    short_description: String
    price: Int
    old_price: Int
    count: Int
    img: String
  }

  input OrderData {
    items: [CartData]!
    total_price: Int
  }

  type Order1 {
    items: [Cart]
    total_price: Int
    payment_method: Payment
    deliver_method: Delivery
  }
  

  type Order {
    person: Person
    order: Order1
  }
  
  type Query {
    getOrder(token: OrderTokenData): Order!
  }

  type Mutation {
    createOrder(person: PersonData, address: AddressData, token: OrderTokenData): OrderToken!
    finishOrder(order: OrderData, token: OrderTokenData): Message
    paymentDelivery(payment: PaymentData, delivery: DeliveryData, token: OrderTokenData!): Message
  }
`;
