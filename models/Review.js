const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewName: String,
  artName: String,
  group: String,
  tags: [String],
  markdownText: String,
  // ... other fields
});

module.exports = mongoose.model("Review", reviewSchema);
