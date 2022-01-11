const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  memes: {
    type: [String],
    required: false,
  },
});

const Category = mongoose.model("category", categorySchema, "category");
module.exports = Category;
