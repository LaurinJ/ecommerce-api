const { gql } = require("apollo-server-express");

module.exports = gql`
  type Product {
    _id: ID
    title: String
    slug: String
    description: String
    short_description: String
    code: String
    price: Float
    old_price: Float
    categories: [Category]
  }

  type ProductData {
    product: [Product!]!
  }

  type Category {
    name: String
    slug: String
  }

  type Query {
    getProducts: ProductData
  }
`;
