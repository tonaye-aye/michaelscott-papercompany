const jwt = require("jsonwebtoken");
const User = require("../models/User");

// require auth for route
const requireAuth = (req, res, next) => {
  // grab JWT token from cookies
  const token = req.cookies.jwt;

  // check to see if the JWT token exists
  if (token) {
    // verify the token, add secret and then pass err, decodedToken
    jwt.verify(token, "devtones secret shush", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // redirect to login if there is a verification error
        res.redirect("/login");
      } else {
        // decoded token
        console.log(decodedToken);
        // continue if the token is legit and there is no error
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  // grab JWT token from cookies
  const token = req.cookies.jwt;

  if (token) {
    // verify the token, add secret and then pass err, decodedToken
    jwt.verify(token, "devtones secret shush", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // set front-end user data to null
        res.locals.user = null;
        next();
      } else {
        // if there is no error, look for the user who mayches the decodedToken's id
        let user = await User.findById(decodedToken.id);
        // set front-end user data to null
        res.locals.user = user;
        next();
      }
    });
  } else {
    // of mo token set front-end user data to null
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
