const express = require("express");
const router = express.Router({ mergeParams: true });
const { likeReview, unlikeReview } = require("../controllers/likeController");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, likeReview);
router.delete("/", authMiddleware, unlikeReview);

module.exports = router;
