const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const uri =
  process.env.MONGOOSE_URL ||
  "mongodb+srv://levanmaghradze97:Lmgr2818@review-portal.rif4hjl.mongodb.net/";
const app = express();

const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/user", userRoutes);
app.use("/review", reviewRoutes);
app.use("/comment", commentRoutes);

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
