const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
