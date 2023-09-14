const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Review = require("../models/Review");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "review_images",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const parser = multer({ storage: storage });

router.post("/upload", parser.single("image"), async (req, res) => {
  try {
    let image_url = null;
    if (req.file) {
      image_url = req.file.path;
    }
    const { title, content } = req.body;
    const newReview = new Review({
      title,
      content,
      image: image_url,
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
