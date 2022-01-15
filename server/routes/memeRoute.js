const express = require("express");
const jwt = require("jsonwebtoken");
const Meme = require("../schema/meme");

const memeRouter = express.Router();

memeRouter.post("/api/meme", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.send(400);
      res.send(err);
    } else {
      // Create Meme
      var meme = new Meme({
        title: req.body.title,
        image: req.body.image,
        category: req.body.category,
        tag: req.body.tag,
        date: new Date(),
        createdBy: data.user["_id"],
      });

      // Save Meme
      meme
        .save()
        .then((doc) => {
          res.send(doc);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  });
});

memeRouter.get("/api/meme", (req, res) => {
  Meme.find({}, ["_id"], { sort: { _id: -1 } }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/meme/:id", async (req, res) => {
  Meme.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/topMeme", async (req, res) => {
  Meme.find({}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      const top = doc.reduce(function (prev, current) {
        return prev.likeCount > current.likeCount ? prev : current;
      });
      res.send(top);
    }
  });
});

memeRouter.get("/api/likedMeme/:id", async (req, res) => {
  Meme.find({ likedBy: req.params.id }, (err, doc) => {
    if (err) {
      res.send(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/postedMeme/:id", async (req, res) => {
  Meme.find({ createdBy: req.params.id }, (err, doc) => {
    if (err) {
      res.send(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/latestMeme", async (req, res) => {
  Meme.findOne({}, {}, { sort: { date: -1 } }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/memeByCategory/:id", (req, res) => {
  Meme.find({ category: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/memeByTag/:id", (req, res) => {
  Meme.find({ tag: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/memeByAuthor/:id", (req, res) => {
  Meme.find({ createdBy: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.get("/api/trendingMeme", (req, res) => {
  Meme.find({}, ["_id", "title", "likedBy"], (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      doc.sort((a, b) => (a.likedBy.length > b.likedBy.length ? -1 : 1));
      res.send(doc);
    }
  });
});

memeRouter.delete("/api/meme/:id", (req, res) => {
  Meme.deleteOne({ _id: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

memeRouter.post("/api/likeMeme", async (req, res) => {
  const userId = req.body.userId;
  const memeId = req.body.memeId;

  Meme.findById(memeId, (err, doc) => {
    if (err) {
      res.send(400);
      res.send(err);
    } else {
      if (doc === null) {
        res.send("Meme already deleted");
      } else {
        if (!doc.likedBy.includes(userId)) {
          doc.likedBy.push(userId);
        } else {
          const index = doc.likedBy.indexOf(userId);
          if (index > -1) {
            doc.likedBy.splice(index, 1);
          }
        }
        doc.save();
        res.send("Done");
      }
    }
  });
});

module.exports = memeRouter;
