// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyClerkJWT } = require("../middleware/auth");

router.post("/register", verifyClerkJWT, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Verify the token's user ID matches the requested userId
    if (req.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Token user ID does not match requested user ID",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User already registered",
        user: {
          id: user._id,
          clerkId: user.clerkId,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          isProfileComplete: user.isProfileComplete,
          createdAt: user.createdAt,
        },
      });
    }

    // Create new user
    user = new User({
      clerkId: userId,
      isProfileComplete: false,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this ID already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.get("/:clerkId", verifyClerkJWT, async (req, res) => {
  try {
    if (req.userId !== req.params.clerkId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only access your own information",
      });
    }

    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
