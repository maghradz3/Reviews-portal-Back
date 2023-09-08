import { generateToken } from "../utils/generateToken.js";
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//registration
router.post("/register", async (req, res) => {
  const {
    firstName: reqFirstName,
    lastName: reqLastName,
    email,
    password,
  } = req.body;

  try {
    const emailExist = await User.find({ email });
    if (emailExist.length) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName: reqFirstName,
      lastName: reqLastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const { _id, firstName, lastName, role } = newUser;
    const { token, refreshToken } = generateToken(
      { _id, firstName, lastName, role },
      "50m",
      "7d"
    );
    return res.status(200).json({
      message: "Registered Succesfully!",
      token,
      refreshToken,
      user: savedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const {
      _id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    } = existingUser;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (isPasswordValid) {
      const { token, refreshToken } = generateToken(
        { _id, firstName, lastName, role },
        "50m",
        "7d"
      );
      return res.status(200).json({
        message: "logged in successfully",
        token,
        refreshToken,
        user: existingUser,
      });
    } else {
      return res.status(422).json({ message: "Password Or Email is invalid" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

//refreshToken
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const user = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (!!user) {
      const { _id, role, firstName, lastName } = user;
      const { token } = generateToken(
        { _id, firstName, lastName, role },
        "50m",
        "7d"
      );
      res.json({ message: "token refreshed successfully", token });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err });
  }
});

//Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Post a new user
router.post("/users", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    password: hashedPassword,
    role: req.body.role,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update a user by ID

router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.role) {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
