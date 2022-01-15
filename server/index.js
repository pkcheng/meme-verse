const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./lib/db");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 5000;

// Schema
const Tag = require("./schema/tag");

// Auth Router
const authRouter = require("./routes/authRoute");
app.use(authRouter);

// Meme Router
const memeRouter = require("./routes/memeRoute");
app.use(memeRouter);

// Category Router
const categoryRouter = require("./routes/categoryRoute");
app.use(categoryRouter);

// Tag Router
const tagRouter = require("./routes/tagRoute");
app.use(tagRouter);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
