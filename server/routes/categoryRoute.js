const express = require("express");
const Category = require("../schema/category");

const categoryRouter = express.Router();

categoryRouter.post("/api/category", (req, res) => {
  var category = new Category({
    title: req.body.title,
    memes: req.body.memes,
  });
  category
    .save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((err) => {
      res.send(err);
    });
});

categoryRouter.get("/api/category", (req, res) => {
  Category.find({}, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

categoryRouter.get("/api/category/:id", (req, res) => {
  Category.findById(req.params.id, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

module.exports = categoryRouter;
