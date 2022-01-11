const mongoose = require("mongoose");

const memeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false,
  },
  image: {
    type: Object,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tag: {
    type: [Object],
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  likedBy: {
    type: [String],
    required: false,
  },
});

memeSchema.virtual("likeCount").get(function () {
  return this.likedBy.length;
});

const Meme = mongoose.model("meme", memeSchema, "meme");
module.exports = Meme;
