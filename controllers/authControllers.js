// import User model and jwt
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  // error containers
  let errors = { email: "", password: "" };

  // incorrect email when LOGGING IN
  if (err.message === "incorrect email") {
    errors.email = "This email could not be found";
  }
  // incorrect password when LOGGING IN
  if (err.message === "incorrect password") {
    errors.email = "This email could not be found";
  }

  // duplicate email validation when SIGNING UP
  if (err.code === 11000) {
    errors.password = "That email is in use.";
    return errors;
  }
  // password and email validation when SIGNING UP
  if (err.message.includes("user validation failed")) {
    // Object.values gets the vlaues of all the objects properties, not the keys
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // return error containers
  return errors;
};

// creating a web token and making a secret and max age
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
  return jwt.sign({ id }, "devtones secret shush", {
    expiresIn: maxAge
  });
};

// render SIGN UP page
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

// render LOG IN page
module.exports.login_get = (req, res) => {
  res.render("login");
};

// SIGN UP - POST
module.exports.signup_post = async (req, res) => {
  // save form inputs from front-end to variable
  const { email, password } = req.body;

  // try create a new user
  try {
    // pass in the input values into the mongo data model
    const user = await User.create({
      email,
      password
    });

    // create a JWT token for the user
    // then set the cookie
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // return the user id
    res.status(201).json({ user: user._id });
  } catch (err) {
    // pass the errors into the handle erros function to customise message
    const errors = handleErrors(err);

    // return the specific detailed errors
    res.status(400).json({ errors });
  }
};

// LOG IN - POST
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  // try to login user
  try {
    // pass in the input values into the mongo data model
    const user = await User.login(email, password);

    // create a JWT token for the user
    // then set the cookie
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // return the user id
    res.status(200).json({ user: user._id });
  } catch (err) {
    // pass the errors into the handle erros function to customise message
    const errors = handleErrors(err);

    // return the specific detailed errors
    res.status(400).json({ errors });
  }
};

// LOGOUT
module.exports.logout_get = (req, res) => {
  // set the cookie to blank, then set the age to 1 millisecond (vanishes)
  res.cookie("jwt", "", { maxAge: 1 });

  // redirect home once logged out
  res.redirect("/");
};
