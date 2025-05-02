const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const User = require("../models/User");
const { verifyClerkJWT } = require("../middleware/auth");
const mongoose = require("mongoose");

/**
 * Get all workout plans
 * GET /api/plans
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/", verifyClerkJWT, async (req, res) => {
  try {
    console.log("GET /api/plans - Fetching workout plans");
    console.log("Auth user:", req.user); // Log the authenticated user

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected when trying to fetch plans");
      return res.status(500).json({
        success: false,
        message: "Database connection issue",
      });
    }

    // Check for existing plans
    const count = await Plan.countDocuments({ isActive: true });
    console.log(`Found ${count} active plans in database`);

    // Fetch plans from database
    const plans = await Plan.find({ isActive: true }).select("-exercises");
    console.log(`Successfully retrieved ${plans.length} plans`);

    // Log the raw plans data for debugging
    console.log(
      "Raw plans data:",
      JSON.stringify(plans).substring(0, 200) + "..."
    );

    // Format the response - ensure proper ID field
    const formattedPlans = plans.map((plan) => ({
      id: plan._id.toString(), // Convert ObjectId to string
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

    // For debugging
    console.log("Sending formatted plans:", formattedPlans.length);
    console.log("First plan:", formattedPlans[0]);

    // Send response as an array
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
    console.log(`GET /api/plans/${req.params.planId} - Fetching plan by ID`);

    // Validate the planId
    if (!mongoose.Types.ObjectId.isValid(req.params.planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID format",
      });
    }

    const plan = await Plan.findById(req.params.planId);

    if (!plan) {
      console.log(`Plan not found with ID: ${req.params.planId}`);
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    console.log(`Found plan: ${plan.name}`);

    res.status(200).json({
      success: true,
      plan: {
        id: plan._id.toString(),
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
    console.log("Creating new workout plan:", req.body);

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
    console.log("New plan created with ID:", newPlan._id);

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      plan: {
        id: newPlan._id.toString(),
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

// Added health check endpoint to test authentication
router.get("/health", verifyClerkJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Plans API is working properly",
    authenticated: true,
    user: req.user,
  });
});

module.exports = router;
