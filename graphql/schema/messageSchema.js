export const typeDefs = `
  type Subscription {
    shareMessage: ChatMessage
  }

  input MessageData {
    from: String
    to: String
    content: String
  }

  type ChatMessage {
    _id: ID
    from: String
    to: String
    content: String
    createdAt: String
  }

  type Query {
    getMessages(id:String): [ChatMessage]!
  }

  type Mutation {
    sendMessage(message: MessageData!): ChatMessage!
  }
`;
