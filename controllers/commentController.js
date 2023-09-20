const Review = require("../models/Review");

exports.addComment = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

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

exports.deleteComment = async (req, res) => {
    try {
      const review = await Review.findById(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  

      const commentIndex = review.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
  
      if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
 
      if (
        review.comments[commentIndex].user.toString() !== req.user._id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "You can't delete this comment" });
      }
  
  
      review.comments.splice(commentIndex, 1);
      
      await review.save();
  
      res.json({ message: "Comment deleted successfully" });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
