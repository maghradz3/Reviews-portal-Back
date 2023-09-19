const express = require("express");
const router = express.Router({ mergeParams: true });
const { addComment } = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, addComment);

module.exports = router;
