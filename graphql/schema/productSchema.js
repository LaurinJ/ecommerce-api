export const typeDefs = `
  scalar Upload

  type Image {
    filename: String
  }

  type Product {
    _id: ID
    title: String!
    slug: String
    description: String
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
    slug: String
    description: String
    short_description: String
    code: String
    price: Int!
    old_price: Int
    countInStock: Int
  }

  type ProductData {
    product: [Product!]!
  }

  input Slug {
    slug: String!
  }

  input FilterData {
    title: String
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
    getProducts(limit: Int, skip: Int): [Product]
    getCountPages: CountPages!
    getFilterProducts(params: FilterData): [Product]
  }

  type Mutation {
    createProduct(product: ProductInputData, images: [Upload]): Product!
  }
`;
