const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const passport = require("passport");

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
    const { _id, firstName, lastName, role, status } = newUser;
    const { token, refreshToken } = generateToken(
      { _id, firstName, lastName, role, status },
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
    if (existingUser.status.includes("Blocked")) {
      return res
        .status(403)
        .json({ message: "User is blocked and cannot log in." });
    }

    const {
      _id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      profilePicture,
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

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/protected",
//     failureRedirect: "/auth/failure",
//   }),
//   (req, res) => {
//     console.log("User:", req.user);
//     res.send("Thank You for logging in with Google");
//   }
// );

// router.get("/auth/failure", (req, res) => {
//   res.send("Failed to login");
// });

// router.get("/protected", (req, res) => {
//   res.send("You are authenticated");
// });

// router.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { scope: "email" })
// );
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

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

//  - Update a user by ID

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

//   Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//User Blocking

router.put("/users/:id/block", async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.status = user.status[0] === "Active" ? ["Blocked"] : ["Blocked"];
    await user.save();
    return res.json({ message: "Status updated successfully", user });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/:id/unblock", async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.status = user.status[0] === "Blocked" ? ["Active"] : ["Active"];
    await user.save();
    return res.json({ message: "Status updated successfully", user });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
