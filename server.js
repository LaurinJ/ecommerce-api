import {} from "dotenv/config";
import http from "http";
import express from "express";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "graphql-tools";
import { ApolloServer } from "apollo-server-express";
import { schema as typeDefs } from "./graphql/schema/schema.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { graphqlUploadExpress } from "graphql-upload";
import mongoose from "mongoose";
import cors from "cors";

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startApolloServer() {
  const corsOptions = {
    origin: "*",
  };
  const app = express();
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(express.static("images"));
  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    cors: cors(corsOptions),
    context: ({ req }) => ({ header: req.headers }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();

  server.applyMiddleware({ app });

  mongoose
    .connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("Could not connect to MongoDB... ", err));

  httpServer.listen(process.env.PORT, () =>
    console.log(
      `Server is now running on http://localhost:${process.env.PORT}/graphql`
    )
  );

  // await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  // console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  // return { server, app };
}

startApolloServer();
