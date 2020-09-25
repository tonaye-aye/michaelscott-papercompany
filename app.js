require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const generalRoutes = require("./routes/generalRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

// Port
const port = process.env.PORT || 3000;

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
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/paper", requireAuth, (req, res) => res.render("paper"));
app.use(authRoutes);
app.use(generalRoutes);

// 404 page
app.use((req, res) => {
  res.render("template", {
    heading: "404 Not found!"
  });
});
