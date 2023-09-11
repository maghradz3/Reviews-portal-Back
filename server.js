const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
dotenv.config();
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

const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/user", userRoutes);
app.use("/review", reviewRoutes);
app.use("/comment", commentRoutes);

// Use express-session to manage sessions
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// This is for setting up session for the authenticated user.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

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
