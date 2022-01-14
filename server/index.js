const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./lib/db");
// const multer = require()
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const port = process.env.PORT || 5000;

// Schema
const User = require("./schema/user");
const Meme = require("./schema/meme");
const Category = require("./schema/category");
const Tag = require("./schema/tag");

// AUTH
app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.find({ email: email }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      if (doc.length < 1) {
        res.send({ auth: false, message: "User not exist" });
      } else {
        bcrypt.compare(password, doc[0].password, (err, same) => {
          if (same) {
            jwt.sign({ user: doc[0] }, process.env.JWT_SECRET, (err, token) => {
              res.send({
                auth: true,
                token: token,
                message: "Login successfully",
              });
            });
          } else {
            res.send({ auth: false, message: "Incorrect password" });
          }
        });
      }
    }
  });
});

app.post("/api/googleLogin", async (req, res) => {
  await axios
    .get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: { authorization: `Bearer ${req.body.token}` },
    })
    .then((doc) => {
      User.findOne({ email: doc.data.email }, (err, usr) => {
        if (!usr) {
          const newUser = new User({
            email: doc.data.email,
            displayname: doc.data.name,
            username: doc.data.name,
            password: "Google",
            googleId: doc.data.id,
          });
          newUser.save().then((newUsr) => {
            let temp = newUsr.toObject();
            temp.access_token = req.body.token;
            jwt.sign({ user: temp }, process.env.JWT_SECRET, (err, token) => {
              res.send({
                auth: true,
                token: token,
                message: "Login successfully",
              });
            });
          });
        } else {
          let temp = usr.toObject();
          temp.access_token = req.body.token;
          jwt.sign({ user: temp }, process.env.JWT_SECRET, (err, token) => {
            res.send({
              auth: true,
              token: token,
              message: "Login successfully",
            });
          });
        }
      });
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

app.post("/api/register", async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const displayname = req.body.displayname;
  const password = await bcrypt.hash(req.body.password, 10);
  var user = new User({
    email: email,
    displayname: displayname,
    username: username,
    password: password,
  });
  user
    .save()
    .then((doc) => {
      res.send(doc);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.post("/api/verify", async (req, res) => {
  const token = req.body.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(data);
    }
  });
});

// POST
app.post("/api/category", (req, res) => {
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

app.post("/api/tag", (req, res) => {
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

app.post("/api/meme", (req, res) => {
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

app.post("/api/likeMeme", async (req, res) => {
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

// GET
app.get("/api/user/:id", (req, res) => {
  User.findById(
    req.params.id,
    ["displayname", "createdMemes", "username"],
    (err, doc) => {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.send(doc);
      }
    }
  );
});

app.get("/api/tag", (req, res) => {
  Tag.find({}, (err, doc) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/category", (req, res) => {
  Category.find({}, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/category/:id", (req, res) => {
  Category.findById(req.params.id, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/latestMeme", async (req, res) => {
  Meme.findOne({}, {}, { sort: { date: -1 } }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/memeByCategory/:id", (req, res) => {
  Meme.find({ category: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/memeByTag/:id", (req, res) => {
  Meme.find({ tag: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/memeByAuthor/:id", (req, res) => {
  Meme.find({ createdBy: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/trendingMeme", (req, res) => {
  Meme.find({}, ["_id", "title", "likedBy"], (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      doc.sort((a, b) => (a.likedBy.length > b.likedBy.length ? -1 : 1));
      res.send(doc);
    }
  });
});

app.get("/api/meme", (req, res) => {
  Meme.find({}, ["_id"], { sort: { _id: -1 } }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/meme/:id", async (req, res) => {
  Meme.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/topMeme", async (req, res) => {
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

app.get("/api/likedMeme/:id", async (req, res) => {
  Meme.find({ likedBy: req.params.id }, (err, doc) => {
    if (err) {
      res.send(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/api/postedMeme/:id", async (req, res) => {
  Meme.find({ createdBy: req.params.id }, (err, doc) => {
    if (err) {
      res.send(400);
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

// DELETE
app.delete("/api/meme/:id", (req, res) => {
  Meme.deleteOne({ _id: req.params.id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
