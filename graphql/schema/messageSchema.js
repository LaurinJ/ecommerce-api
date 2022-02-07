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

  input ContactData {
    email: String
    content: String
  }

  type ContactMessage {
    _id: ID
    email: String
    content: String
    read: Boolean
    createdAt: String
  }

  type ContactMessages {
    messages: [ContactMessage]!
    pages: Int!
  }

  type Query {
    getMessages(id:String): [ChatMessage]!
    getAdminToken: AdminChatToken
    getContactMessages(limit: Int, skip: Int): ContactMessages!
  }

  type Mutation {
    sendMessage(message: MessageData!): ChatMessage!
    setAdminToken(token: String!): AdminChatToken!
    deleteAdminToken(token: String!): AdminChatToken
    sendContactMessage(message: ContactData): ContactMessage
  }
`;
