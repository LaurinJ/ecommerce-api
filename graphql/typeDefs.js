const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload

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
    getProduct(slug: Slug!): Product!
    getProducts: ProductData!
  }

  type Mutation {
    createProduct(product: ProductInputData, images: [Upload!]!): Product!
  }
`;
