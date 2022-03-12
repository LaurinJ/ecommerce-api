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

  input ChangePasswordData {
    old_password: String
    password: String
    confirm_password: String
  }

  input ResetPasswordData {
    password: String
    confirm_password: String
  }

  type CheckToken {
    status: Boolean!
    email: String!
  }

  type Query {
    checkResetPasswordToken(token: String!): CheckToken!
  }

  type Mutation {
    createUser(user: userRegisterData!): User_Token
    login(user: userLoginData): User_Token!
    logout(token: RefreshToken!): Message
    generateRefreshToken(token: RefreshToken!): Token!
    googleLogin(token: String): User_Token!
    changePassword(passwords: ChangePasswordData): Message
    resetPassword(passwords: ResetPasswordData, email: String): Message
    sendChangeEmail(email: String!): Message
    subscribeToNews(email: String!): Message
  }
`;
