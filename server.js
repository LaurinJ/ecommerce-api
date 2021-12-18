// const express = require("express");
// const { ApolloServer } = require("apollo-server-express");
// const typeDefs = require("./graphql/typeDefs");
// const resolvers = require("./graphql/resolvers/index");
// const { graphqlUploadExpress } = require("graphql-upload");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// import "./config.js";
import {} from "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
// import { typeDefs } from "./graphql/typeDefs.js";
import { schema } from "./graphql/schema/schema.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { graphqlUploadExpress } from "graphql-upload";
import mongoose from "mongoose";
import cors from "cors";

// import { startApolloServer } from "./apollo.js";

async function startApolloServer() {
  const corsOptions = {
    origin: "*",
  };

  const server = new ApolloServer({
    typeDefs: schema,
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
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("Could not connect to MongoDB... ", err));

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
