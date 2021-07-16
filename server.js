const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

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
