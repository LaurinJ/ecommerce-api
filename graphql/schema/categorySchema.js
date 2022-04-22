export const typeDefs = `
  input CategoryData {
    _id: ID
    name: String
    hidden: Boolean
  }

  type Category {
      _id: ID
      name: String!
      slug: String!
      hidden: Boolean
  }

  type Categories {
    categories: [Category]!
    pages: Int
}

  type Query {
    getCategory(id: String): Category
    getCategories: [Category]!
    getAllCategories(limit: Int, skip: Int): Categories
  }

  type Mutation {
    createCategory(category: CategoryData!): Category!
    editCategory(category: CategoryData!): Category!
    deleteCategory(id: String!): Category!
  }
`;
