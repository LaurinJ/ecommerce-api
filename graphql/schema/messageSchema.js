export const typeDefs = `
  type Subscription {
    userReg: User
  }

  input MessageData {
    _id: ID
    from: String
    to: String
    content: String
  }

  type ChatMessage {
    _id: ID
    from: String
    to: String
    content: String
  }

  type Query {
    getMessages(id:String): [ChatMessage]!
  }

  type Mutation {
    sendMessage(message: MessageData!): ChatMessage!
  }
`;
