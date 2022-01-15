const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../schema/user");

const authRouter = express.Router();

authRouter.post("/api/verify", async (req, res) => {
  const token = req.body.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(data);
    }
  });
});

authRouter.post("/api/login", (req, res) => {
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

authRouter.post("/api/googleLogin", async (req, res) => {
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

authRouter.post("/api/register", async (req, res) => {
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

authRouter.get("/api/user/:id", (req, res) => {
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

module.exports = authRouter;
