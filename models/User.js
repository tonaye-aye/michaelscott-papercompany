const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter an password."],
    minlength: [6, "Minimum password length is 6 characters."]
  }
});

// mongoose middleware/hooks

// fire off a function BEFORE(pre) a doc is saved to the DB
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  // find the user's email in the database and store it
  const user = await this.findOne({ email });
  // if the email does exist compare it to the email that was passed through at log in attempt
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  // throw an error if the email doesnt exist in the db when trying to log in
  throw Error("incorrect email");
};

// 'user' needs to be lowercase, since its plural is the name of the MongoDB collectiopn DB
const User = mongoose.model("user", userSchema);

module.exports = User;
