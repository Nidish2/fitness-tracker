const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyClerkJWT } = require("../middleware/auth");

/**
 * Update user profile
 * PUT /api/users/:clerkId
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.put("/:clerkId", verifyClerkJWT, async (req, res) => {
  try {
    // Verify the token's user ID matches the requested clerkId
    if (req.userId !== req.params.clerkId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only update your own profile",
      });
    }

    const { firstName, lastName, email, age, gender, fitnessLevel } = req.body;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user profile fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;

    // Set additional fields if they exist in the request
    if (typeof age === "number") user.age = age;
    if (gender) user.gender = gender;
    if (fitnessLevel) user.fitnessLevel = fitnessLevel;

    // Mark profile as complete if essential fields are filled
    if (firstName && lastName && email) {
      user.isProfileComplete = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        fitnessLevel: user.fitnessLevel,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Additional user routes could be added here

module.exports = router;
