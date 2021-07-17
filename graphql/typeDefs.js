const { gql } = require("apollo-server-express");

module.exports = gql`
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
  }

  input ProductInputData {
    title: String!
    description: String!
    price: Int!
  }

  type ProductData {
    product: [Product!]!
  }

  type Category {
    name: String
    slug: String
  }

  type Query {
    getProducts: ProductData!
  }

  type Mutation {
    createProduct(product: ProductInputData): Product!
  }
`;
