const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/product");
// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
// const tagRoutes = require("./routes/tag");
// const formRoutes = require("./routes/form");

const app = express();

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Could not connect to MongoDB... ", err));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV == "developmet") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

app.use("/api", productRoutes);
// app.use("/api", authRoutes);
// app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
// app.use("/api", tagRoutes);
// app.use("/api", formRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
