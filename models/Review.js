const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artworkName: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    enum: ["Movies", "Books", "Games"],
    // required: true,
  },
  tags: [String],
  content: {
    type: String,
    required: true,
  },
  image: {
    // URL to cloud storage
    type: String,
    default: null,
  },

  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  textarrea: {
    type: String,
    required: true,
  },

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

reviewSchema.index({
  title: "text",
  pieceName: "text",
  content: "text",
  "comments.text": "text",
  tags: "text",
});

module.exports = mongoose.model("Review", reviewSchema);
