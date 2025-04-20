const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Plan = require("../models/Plan");
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
        selectedPlanId: user.selectedPlanId,
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

/**
 * Select a workout plan for the user
 * POST /api/users/:clerkId/plan
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.post("/:clerkId/plan", verifyClerkJWT, async (req, res) => {
  try {
    // Verify the token's user ID matches the requested clerkId
    if (req.userId !== req.params.clerkId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only select plans for your own account",
      });
    }

    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // Verify that the plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    // Find user by clerkId
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user's selected plan
    user.selectedPlanId = planId;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Workout plan selected successfully",
      user: {
        id: user._id,
        clerkId: user.clerkId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        fitnessLevel: user.fitnessLevel,
        selectedPlanId: user.selectedPlanId,
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error selecting workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to select workout plan",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get user's selected workout plan
router.get("/:clerkId/plan", verifyClerkJWT, async (req, res) => {
  try {
    // Verify the token's user ID matches the requested clerkId
    if (req.userId !== req.params.clerkId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only view your own plans",
      });
    }

    // Find user by clerkId
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.selectedPlanId) {
      return res.status(404).json({
        success: false,
        message: "No workout plan selected",
      });
    }

    // Get the selected plan
    const plan = await Plan.findById(user.selectedPlanId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Selected workout plan not found",
      });
    }

    res.status(200).json({
      success: true,
      plan: {
        id: plan._id,
        name: plan.name,
        description: plan.description,
        intensity: plan.intensity,
        duration: plan.duration,
        targetAgeMin: plan.targetAgeMin,
        targetAgeMax: plan.targetAgeMax,
        targetGender: plan.targetGender,
        daysPerWeek: plan.daysPerWeek,
        exercises: plan.exercises.map((exercise) => ({
          name: exercise.name,
          description: exercise.description,
          durationMinutes: exercise.durationMinutes,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
          imageUrl: exercise.imageUrl,
          videoUrl: exercise.videoUrl,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching user's workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plan",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
