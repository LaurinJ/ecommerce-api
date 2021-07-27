const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload

  type User {
    _id: ID
    name: String!
    email: String!
    role: Int
  }

  type Token {
    accessToken: String!
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
    categories: [Category]
    images: [Image]
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

  type Query {
    login(user: userLoginData): Token!
    getProduct(slug: Slug!): Product!
    getProducts: ProductData!
  }

  type Mutation {
    createUser(user: userRegisterData!): Token!
    createProduct(product: ProductInputData, images: [Upload!]!): Product!
  }
`;
