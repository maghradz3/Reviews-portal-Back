const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
dotenv.config();
const passport = require("passport");
const uri = process.env.MONGOOSE_URL;

require("./passportConfig");

const app = express();

//general middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://master.d27f5crjw8848s.amplifyapp.com/",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    "Content-Type",
    "Acces-Control-Allow-Origin",
    "Access-Control-Allow-Credentials0,Authorization",
    "Accept",
  ],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

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
const likeRoutes = require("./routes/likesRoutes");
const cloudUploads = require("./cloudinary/cloudinariConfig");

app.use("/user", userRoutes);
app.use("/review", reviewRoutes);
app.use("/review/:reviewId/comments", commentRoutes);
app.use("/review/:reviewId/comments/:commentId", commentRoutes);
app.use("/review/:reviewId/likes", likeRoutes);
app.use("/cloud", cloudUploads);

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
