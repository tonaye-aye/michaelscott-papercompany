require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const generalRoutes = require("./routes/generalRoutes");
const secureRoutes = require("./routes/secureRoutes");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/authMiddleware");

// Port
const port = process.env.PORT || 4000;

// initialise app
const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => {
    app.listen(port);
    console.log(`Running on port: ${port}`);
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.use(authRoutes);
app.use(generalRoutes);
app.use(secureRoutes);

// 404 page
app.use((req, res) => {
  res.render("404", {
    heading: "404 Not found!"
  });
});
