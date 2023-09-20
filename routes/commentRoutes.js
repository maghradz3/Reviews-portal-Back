const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addComment,
  deleteComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, addComment);
router.delete("/", authMiddleware, deleteComment);

module.exports = router;
