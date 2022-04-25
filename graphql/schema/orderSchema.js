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
    items: [CartData!]!
    total_price: Int
  }

  input EditOrderData {
    items: [CartData!]!
    total_price: Int
    payment: String
    delivery: String
  }

  type Order {
    _id: String
    items: [Cart]
    total_price: Int
    person: Person
    payment_method: Payment
    deliver_method: Delivery
    state: String
    orderNumber: String
    is_paid: Boolean
    paid_at: String
    is_deliver: Boolean
    delivered_at: String
    createdAt: String
  }

  type Orders {
    orders: [Order]
    pages: Int
  }

  input FilterOrderData {
    numberOrder: String
  }
  
  type OrdersCount {
    orders: Int
  }

  type OrdersTotal {
    total: Int
  }

  type Query {
    getOrdersCount: OrdersCount
    getOrdersTotal: OrdersTotal
    getOrder(orderNumber: String): Order!
    getOrders(params: FilterOrderData, limit: Int, skip: Int): Orders!
    getUserOrders(limit: Int, skip: Int): Orders!
  }

  type Mutation {
    createOrUpdateOrder(person: PersonData, address: AddressData, token: OrderTokenData): OrderToken!
    paymentDelivery(payment: PaymentData, delivery: DeliveryData, token: OrderTokenData!): Message
    finishOrder(order: OrderData, token: OrderTokenData): Order!
    deleteOrder(id: String): Order!
    editOrder(orderNumber: String,  person: PersonData, address: AddressData, order: EditOrderData): Order    
    sendOrder(orderNumber: String): Message    
    suspendOrder(orderNumber: String): Message    
    cancelOrder(orderNumber: String): Message    
  }
`;
