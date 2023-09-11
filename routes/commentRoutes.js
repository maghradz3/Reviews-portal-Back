const express = require("express");
const router = express.Router();
const passport = require("passport");
const Comment = require("../models/Comment");

// Get comments for a specific review
router.get("/review/:reviewId", async (req, res) => {
  try {
    const comments = await Comment.find({
      review: req.params.reviewId,
    }).populate("user", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a comment to a review
router.post(
  "/review/:reviewId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { text } = req.body;
    const comment = new Comment({
      text: text,
      review: req.params.reviewId,
      user: req.user._id,
    });
    try {
      const savedComment = await comment.save();
      res.status(201).json(savedComment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = router;
