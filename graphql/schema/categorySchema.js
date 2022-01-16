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

  type Query {
    getCategory(id: String): Category
    getCategories(limit: Int, skip: Int): [Category]!
  }

  type Mutation {
    createCategory(category: CategoryData!): Category!
    editCategory(category: CategoryData!): Category!
  }
`;
