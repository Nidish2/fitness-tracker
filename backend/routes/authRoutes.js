// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Protected route that automatically creates a user if not exists
router.get("/protected", authMiddleware, async (req, res) => {
  try {
    console.log("Protected route accessed with clerkId:", req.user.id);

    // Check if user exists
    let user = await User.findOne({ clerkId: req.user.id });

    if (!user) {
      console.log(
        "User not found, creating new user with clerkId:",
        req.user.id
      );
      // Create user in MongoDB if not exists
      const newUser = new User({
        clerkId: req.user.id,
        name: req.user.name || null,
        // Add any other fields you want to initialize
      });

      user = await newUser.save();
      console.log("New user created:", user._id);

      return res.json({
        message: "New user created successfully",
        user: {
          id: user._id,
          clerkId: user.clerkId,
          name: user.name,
        },
      });
    }

    console.log("Existing user found:", user._id);
    res.json({
      message: "Protected route accessed successfully",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
