const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const User = require("../models/User");
const { verifyClerkJWT } = require("../middleware/auth");

/**
 * Get all workout plans
 * GET /api/plans
 * Headers: Authorization: Bearer <clerk_jwt>
 */
// Update the GET /api/plans route handler in plans.js
router.get("/", verifyClerkJWT, async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).select("-exercises");

    // Format the response as an array directly instead of a nested object
    const formattedPlans = plans.map((plan) => ({
      id: plan._id,
      name: plan.name,
      description: plan.description,
      intensity: plan.intensity,
      duration: plan.duration,
      targetAgeMin: plan.targetAgeMin,
      targetAgeMax: plan.targetAgeMax,
      targetGender: plan.targetGender,
      daysPerWeek: plan.daysPerWeek,
      exercises: plan.exercises ? plan.exercises.length : 0,
    }));

    res.status(200).json(formattedPlans);
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plans",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Get a specific workout plan by ID
 * GET /api/plans/:planId
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/:planId", verifyClerkJWT, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
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
    console.error("Error fetching workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plan",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Create a new workout plan (admin only - to be replaced with proper authorization)
 * POST /api/plans
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.post("/", verifyClerkJWT, async (req, res) => {
  try {
    // TODO: Add proper admin authorization here

    const { name, description, intensity, duration, exercises, ...rest } =
      req.body;

    // Validate required fields
    if (!name || !intensity || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, intensity, and duration are required fields",
      });
    }

    const newPlan = new Plan({
      name,
      description,
      intensity,
      duration,
      exercises: exercises || [],
      ...rest,
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      plan: {
        id: newPlan._id,
        name: newPlan.name,
        description: newPlan.description,
        intensity: newPlan.intensity,
        duration: newPlan.duration,
      },
    });
  } catch (error) {
    console.error("Error creating workout plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create workout plan",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
