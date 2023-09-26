const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, requeired: true },
  email: { type: String, required: true },
  password: {
    type: String,
  },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  googleId: {
    type: String,
  },
  profilePicture: {
    // URL to cloud storage
    type: String,
    default: null,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  status: { type: [String], default: ["Active"] },
});

module.exports = mongoose.model("User", userSchema);
