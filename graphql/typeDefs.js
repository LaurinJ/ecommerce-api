const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload

  type Message {
    status: String
    text: String
  }

  type User {
    _id: ID
    name: String!
    email: String!
    role: Int
  }

  type User_Token {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Token {
    accessToken: String!
    refreshToken: String!
  }

  input RefreshToken {
    refreshToken: String!
  }

  input userLoginData {
    email: String
    password: String
  }

  input userRegisterData {
    name: String!
    email: String!
    password: String!
    confirm_password: String!
  }

  type Image {
    filename: String
  }

  type Product {
    _id: ID
    title: String!
    slug: String
    description: String!
    short_description: String
    code: String
    price: Int!
    old_price: Int
    countInStock: Int
    rating: Int
    rating_sum: Int
    categories: [Category]
    images: [String]
    imgurl: String
  }

  input ProductInputData {
    title: String!
    description: String!
    price: Int!
    categories: [String]
  }

  type ProductData {
    product: [Product!]!
  }

  input Slug {
    slug: String!
  }

  type Category {
    name: String
  }

  type CountPages {
    pages: Int!
  }

  type Query {
    testmultisave: Product!
    getProduct(slug: String!): Product!
    getProducts(limit: Int, skip: Int): [Product!]
    getCountPages: CountPages!
  }

  type Mutation {
    createUser(user: userRegisterData!): User_Token
    login(user: userLoginData): User_Token
    logout(token: RefreshToken!): Message
    generateRefreshToken(token: RefreshToken!): Token!
    createProduct(product: ProductInputData, images: [Upload]): Product!
  }
`;
