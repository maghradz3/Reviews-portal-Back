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
router.post("/upload", authMiddleware, roleMiddleware, createReview);
router.get("/search", searchReviews);
router.get("/:reviewId", getReviewById);
router.put("/:reviewId", authMiddleware, roleMiddleware, updateReview);
router.delete("/:reviewId", authMiddleware, roleMiddleware, deleteReview);

module.exports = router;
