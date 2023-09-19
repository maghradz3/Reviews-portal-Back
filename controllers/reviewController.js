const Review = require("../models/Review");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("author").exec();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createReview = async (req, res) => {
  const newReview = new Review({
    ...req.body,
    // author: req.user._id,
  });

  try {
    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate("author")
      .exec();
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true }
    ).populate("author");
    if (!updatedReview)
      return res.status(404).json({ message: "Review not found" });
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the user is the author or an admin
    if (
      review.author.toString() !== req.user._id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You can't delete this review" });
    }

    await Product.findByIdAndRemove(req.params.reviewId);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchReviews = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    const reviews = await Review.find({
      $text: {
        $search: searchQuery,
      },
    }).populate("comments.user", "firstName lastName");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
