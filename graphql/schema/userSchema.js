export const typeDefs = `
  type Message {
    message: String
  }

  type User {
    _id: ID
    name: String!
    email: String!
    role: Int
  }

  type User_Token {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Token {
    accessToken: String!
    refreshToken: String!
  }

  input RefreshToken {
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
    confirm_password: String!
  }

  type Mutation {
    createUser(user: userRegisterData!): User_Token
    login(user: userLoginData): User_Token!
    logout(token: RefreshToken!): Message
    generateRefreshToken(token: RefreshToken!): Token!
    googleLogin(token: String): User_Token!
    subscribeToNews(email: String!): Message
  }
`;
