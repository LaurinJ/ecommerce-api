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
    _id: ID
    title: String!
    description: String
    short_description: String
    code: String
    price: Int!
    old_price: Int
    countInStock: Int
    hidden: Boolean
    categories: [ID]
  }
  
  type ProductData {
    product: [Product!]!
  }

  input Slug {
    slug: String!
  }

  input FilterData {
    title: String
    category: ID
    min_price: Int
    max_price: Int
  }

  type FilterProducts{
    products: [Product]
    pages: Int
  }

  type CountProducts {
    count: Int!
  }

  type Query {
    testmultisave: Product!
    getProduct(slug: String!): Product!
    getProducts(limit: Int, skip: Int, query: String): [Product]
    getCountProducts: CountProducts!
    getFilterProducts(params: FilterData, limit: Int, skip: Int): FilterProducts!
  }

  type Mutation {
    createProduct(product: ProductInputData, images: [Upload]): Product!
    editProduct(product: ProductInputData, images: [Upload]): Product!
  }
`;
