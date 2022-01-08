export const typeDefs = `
  type Subscription {
    shareMessage: ChatMessage
    adminOnline: AdminChatToken
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

  type AdminChatToken {
    token: String
  }

  type Query {
    getMessages(id:String): [ChatMessage]!
    getAdminToken: AdminChatToken
  }

  type Mutation {
    sendMessage(message: MessageData!): ChatMessage!
    setAdminToken(token: String!): AdminChatToken!
    deleteAdminToken(token: String!): AdminChatToken
  }
`;
