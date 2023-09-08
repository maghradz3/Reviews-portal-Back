const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  pieceOfArt: String,
  group: { type: String, enum: ["Movies", "Books", "Games"] },
  tags: [String],
  reviewText: String,
  image: {
    // URL to cloud storage
    type: String,
    default: null,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  grade: { type: Number, min: 0, max: 10 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
