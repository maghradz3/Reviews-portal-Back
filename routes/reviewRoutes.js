const express = require("express");
const Review = require("../models/Review");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  searchReviews,
} = require("../controllers/reviewController");

router.get("/", getAllReviews);
router.post("/upload", createReview);
router.get("/search", searchReviews);
router.get("/:reviewId", getReviewById);
router.put("/:reviewId", authMiddleware, updateReview);
router.delete("/:reviewId", authMiddleware, deleteReview);

// router.post("/upload", async (req, res) => {
//   const newReview = new Review({
//     ...req.body,
//     // author: req.user._id,
//   });

//   try {
//     const savedReview = await newReview.save();
//     res.json(savedReview);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
