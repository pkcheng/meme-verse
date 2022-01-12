const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

const Tag = mongoose.model("tag", tagSchema, "tag");
module.exports = Tag;
