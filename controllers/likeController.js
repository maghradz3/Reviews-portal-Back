const Review = require("../models/Review");

exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (review.likes.some((like) => like.user.toString() === req.user._id)) {
      return res.status(400).json({ msg: "Review already liked by this user" });
    }

    review.likes.unshift({ user: req.user._id });
    await review.save();
    res.json(review.likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review.likes.some((like) => like.user.toString() === req.user._id)) {
      return res
        .status(400)
        .json({ msg: "Review has not yet been liked by this user" });
    }

    review.likes = review.likes.filter(
      ({ user }) => user.toString() !== req.user._id
    );

    await review.save();
    res.json(review.likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
