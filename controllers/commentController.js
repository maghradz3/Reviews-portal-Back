const Review = require("../models/Review");

exports.addComment = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    const newComment = {
      text: req.body.text,
      user: req.user._id,
    };

    review.comments.push(newComment);

    await review.save();
    res.json(review.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
