const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
dotenv.config();
const passport = require("passport");
const uri =
  process.env.MONGOOSE_URL ||
  "mongodb+srv://levanmaghradze97:Lmgr2818@review-portal.rif4hjl.mongodb.net/";

require("./passportConfig");

const app = express();

//general middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

app.use("/user", userRoutes);
app.use("/review", reviewRoutes);
app.use("/review/:reviewId/comments", commentRoutes);
app.use("/review/:reviewId/likes", likeRoutes);

// Connect to MongoDB

(async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.get("/", (req, res) => {
      res.send("Review Portal Backend");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("error while starting!", err);
  }
})();
