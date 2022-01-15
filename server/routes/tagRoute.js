const express = require("express");
const Tag = require("../schema/tag");

const tagRouter = express.Router();

tagRouter.post("/api/tag", (req, res) => {
  var tag = new Tag({
    title: req.body.title,
  });
  tag
    .save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((err) => {
      res.send(err);
    });
});

tagRouter.get("/api/tag", (req, res) => {
  Tag.find({}, (err, doc) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

module.exports = tagRouter;
