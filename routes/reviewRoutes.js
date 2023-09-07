const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ... Other CRUD operations for Reviews

module.exports = router;
