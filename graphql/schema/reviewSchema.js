export const typeDefs = `
  type Review {
    _id: ID
    user: User
    product: Product
    content: String
    rating: Int
    createdAt: String
  }
  

  type Reviews {
    reviews: [Review]!
    pages: Int
  }

  input ReviewData {
    product: ID
    content: String
    rating: Int
  }
  
  type Query {
    getReviews(product_id: ID!, limit: Int, skip: Int): Reviews!
    getUserReviews(limit: Int, skip: Int): Reviews!
  }

  type Mutation {
    createReview(review: ReviewData): Review!
  }
`;
