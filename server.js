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
import { typeDefs } from "./graphql/typeDefs.js";
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

// const productRoutes = require("./routes/product");
// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
// const categoryRoutes = require("./routes/category");
// const tagRoutes = require("./routes/tag");
// const formRoutes = require("./routes/form");
const { app } = startApolloServer();
console.log(app);
// app.use(morgan("dev"));
// app.use(bodyParser.json());
// app.use(cookieParser());

// if (process.env.NODE_ENV == "developmet") {
//   app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }

// app.use("/api", productRoutes);
// app.use("/api", authRoutes);
// app.use("/api", userRoutes);
// app.use("/api", categoryRoutes);
// app.use("/api", tagRoutes);
// app.use("/api", formRoutes);

// const port = process.env.PORT;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
