require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");

// this is only for checking purpose
const usersRoutes = require("./routes/users");

// Db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("DB SOME ERROR OCCURE");
  });

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);

// its just checking purpose route
app.use("/api", usersRoutes);

// port
const port = process.env.PORT || 8000;

// Starting server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
