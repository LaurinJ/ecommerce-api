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
    hidden: Boolean
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
  
  input Slug {
    slug: String!
  }

  input FilterData {
    title: String
    category: ID
    min_price: Int
    max_price: Int
    sort: String
  }

  type FilterProducts{
    products: [Product]!
    pages: Int
  }

  type CountProducts {
    count: Int!
  }

  type Query {
    mockData: Product!
    getProduct(slug: String!): Product!
    getProducts(limit: Int, skip: Int, query: String): [Product]
    getProductsByCategory(limit: Int, skip: Int, params: FilterData): FilterProducts!
    getCountProducts: CountProducts!
    getFilterProducts(params: FilterData, limit: Int, skip: Int): FilterProducts!
  }

  type Mutation {
    createProduct(product: ProductInputData, images: [Upload]): Product!
    editProduct(product: ProductInputData, images: [Upload]): Product!
    deleteProduct(id: String): Product!
  }
`;
