import jwt from "jsonwebtoken";

export const contextMiddleware = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer")[1];
  }

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  return context;
};
