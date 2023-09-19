const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Review = require("../models/Review");
const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.url);
      }
    });

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
});

router.post("/uploadReviewImg", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadToCloudinary(req.file.buffer);
    const reviewData = { ...req.body, image: imageUrl };
    reviewData.tags = JSON.parse(req.body.tags);

    const createdReview = await Review.create(reviewData);

    res
      .status(201)
      .json({ message: "Review created successfully", review: createdReview });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.post(
  "/uploadUserImg",
  upload.single("profilePicutre"),
  async (req, res) => {
    try {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      const userData = { ...req.body, profilePicture: imageUrl };
      userData.tags = JSON.parse(req.body.tags);

      const createdUser = await User.create(userData);

      res
        .status(201)
        .json({ message: "User created successfully", user: createdUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
);

module.exports = router;
