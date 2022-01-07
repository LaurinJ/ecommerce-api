import jwt from "jsonwebtoken";

export const contextMiddleware = (context, connection) => {
  let token;
  let chatId;
  console.log(context.connectionParams);
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
    chatId = context.req.headers.chatid;
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
    chatId = context.connection.context.chatid;
    console.log(context);
  }
  context.chatId = chatId;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  return context;
};
