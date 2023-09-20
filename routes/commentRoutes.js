const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addComment,
  deleteComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post("/", authMiddleware, addComment);
router.delete("/", authMiddleware, roleMiddleware, deleteComment);

module.exports = router;
