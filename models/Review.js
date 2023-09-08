const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  pieceOfArt: String,
  group: { type: String, enum: ["Movies", "Books", "Games"] },
  tags: [String],
  reviewText: String,
  image: String,
  grade: { type: Number, min: 0, max: 10 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Review", reviewSchema);
