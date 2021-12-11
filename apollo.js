import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { graphqlUploadExpress } from "graphql-upload";
import mongoose from "mongoose";
import cors from "cors";

export async function startApolloServer() {
  const corsOptions = {
    origin: "*",
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: cors(corsOptions),
    context: ({ req }) => ({ header: req.headers }),
  });
  await server.start();

  const app = express();
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(express.static("images"));
  server.applyMiddleware({ app });
  console.log(process.env.DATABASE_LOCAL);

  mongoose
    .connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("Could not connect to MongoDB... ", err));

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}
