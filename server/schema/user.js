const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  displayname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdMemes: {
    type: Array,
    required: false,
  },
  likedMemes: {
    type: Array,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("user", userSchema, "user");
module.exports = User;
