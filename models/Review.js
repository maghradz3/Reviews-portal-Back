const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artworkName: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    enum: ["Movies", "Books", "Games"],
    required: true,
  },
  tags: [String],
  reviewText: {
    type: String,
    required: true,
  },
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
  grade: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
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
