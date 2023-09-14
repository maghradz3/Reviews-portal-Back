const express = require("express");
const router = express.Router({ mergeParams: true });
const { likeReview, unlikeReview } = require("../controllers/likeController");

router.post("/", likeReview);
router.delete("/", unlikeReview);

module.exports = router;
