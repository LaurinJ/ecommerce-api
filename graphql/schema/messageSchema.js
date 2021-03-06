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
    answer: Boolean
    createdAt: String
  }

  type ContactMessages {
    messages: [ContactMessage]!
    pages: Int!
  }

  type ContactMessagesCount {
    messages: Int
  }

  type Query {
    getMessages(id:String): [ChatMessage]!
    getAdminToken: AdminChatToken
    getContactMessages(limit: Int, skip: Int): ContactMessages!
    getContactMessage(id: String!): ContactMessage!
    getContactMessagesCount: ContactMessagesCount
  }

  type Mutation {
    sendMessage(message: MessageData!): ChatMessage!
    setAdminToken(token: String!): AdminChatToken!
    deleteAdminToken(token: String!): AdminChatToken
    sendContactMessage(message: ContactData): ContactMessage
    answerContactMessage(id: String!,message: ContactData): Message!
    readContactMessage(id: String!): Message!
    deleteContactMessage(id: String!): ContactMessage!
  }
`;
