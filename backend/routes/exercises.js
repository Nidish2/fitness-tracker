const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyClerkJWT } = require("../middleware/auth");

// ExerciseDB API configuration
const EXERCISEDB_API_URL =
  process.env.EXERCISEDB_API_URL || "https://exercisedb.p.rapidapi.com";
const EXERCISEDB_API_KEY = process.env.EXERCISEDB_API_KEY;

// Cache exercises to reduce API calls (in-memory cache)
let exerciseCache = {
  allExercises: null,
  timestamp: null,
  // Cache expires after 24 hours
  expiryTime: 24 * 60 * 60 * 1000,
};

/**
 * Get exercises from ExerciseDB API
 * GET /api/exercises
 * Query params: type, muscle, difficulty
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/", verifyClerkJWT, async (req, res) => {
  try {
    const { type, muscle, difficulty } = req.query;

    // Check if cache is valid
    const now = Date.now();
    const cacheIsValid =
      exerciseCache.allExercises &&
      exerciseCache.timestamp &&
      now - exerciseCache.timestamp < exerciseCache.expiryTime;

    // Fetch all exercises if cache is not valid
    if (!cacheIsValid) {
      const response = await axios.get(`${EXERCISEDB_API_URL}/exercises`, {
        headers: {
          "X-RapidAPI-Key": EXERCISEDB_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });

      exerciseCache.allExercises = response.data;
      exerciseCache.timestamp = now;
    }

    // Apply filters if any
    let filteredExercises = exerciseCache.allExercises;

    if (type) {
      filteredExercises = filteredExercises.filter(
        (ex) => ex.type.toLowerCase() === type.toLowerCase()
      );
    }

    if (muscle) {
      filteredExercises = filteredExercises.filter(
        (ex) => ex.muscle.toLowerCase() === muscle.toLowerCase()
      );
    }

    if (difficulty) {
      filteredExercises = filteredExercises.filter(
        (ex) => ex.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Transform the response to match our Exercise schema
    const exercises = filteredExercises.map((ex) => ({
      name: ex.name,
      description: ex.instructions ? ex.instructions.join(" ") : "",
      durationMinutes: 5, // Default duration, can be adjusted
      sets: 3, // Default sets
      reps: 10, // Default reps
      restSeconds: 60, // Default rest time
      imageUrl: ex.gifUrl,
      videoUrl: null,
      exerciseDbId: ex.id,
    }));

    res.status(200).json({
      success: true,
      exercises,
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);

    // Handle API errors
    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded for ExerciseDB API",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Add these new routes to the existing exercises.js file

/**
 * Get exercise details by ID
 * GET /api/exercises/:id
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/:id", verifyClerkJWT, async (req, res) => {
  try {
    const exerciseId = req.params.id;

    // Check if cache is valid (reuse existing cache checking logic)
    const now = Date.now();
    const cacheIsValid =
      exerciseCache.allExercises &&
      exerciseCache.timestamp &&
      now - exerciseCache.timestamp < exerciseCache.expiryTime;

    // Fetch all exercises if cache is not valid (reuse existing code)
    if (!cacheIsValid) {
      const response = await axios.get(`${EXERCISEDB_API_URL}/exercises`, {
        headers: {
          "X-RapidAPI-Key": EXERCISEDB_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });

      exerciseCache.allExercises = response.data;
      exerciseCache.timestamp = now;
    }

    // Find the exercise by ID
    const exercise = exerciseCache.allExercises.find(
      (ex) => ex.id === exerciseId
    );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
    }

    // Transform the response to match our Exercise schema
    const formattedExercise = {
      name: exercise.name,
      description: exercise.instructions ? exercise.instructions.join(" ") : "",
      durationMinutes: 5, // Default duration
      sets: 3, // Default sets
      reps: 10, // Default reps
      restSeconds: 60, // Default rest time
      imageUrl: exercise.gifUrl,
      videoUrl: null,
      exerciseDbId: exercise.id,
      muscle: exercise.bodyPart,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty || "intermediate", // Default difficulty
    };

    res.status(200).json({
      success: true,
      exercise: formattedExercise,
    });
  } catch (error) {
    console.error("Error fetching exercise details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Get list of exercise categories (bodyParts)
 * GET /api/exercises/categories/bodyparts
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/categories/bodyparts", verifyClerkJWT, async (req, res) => {
  try {
    const response = await axios.get(
      `${EXERCISEDB_API_URL}/exercises/bodyPartList`,
      {
        headers: {
          "X-RapidAPI-Key": EXERCISEDB_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    res.status(200).json({
      success: true,
      bodyParts: response.data,
    });
  } catch (error) {
    console.error("Error fetching body parts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch body parts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Get list of exercise types (types)
 * GET /api/exercises/categories/types
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/categories/types", verifyClerkJWT, async (req, res) => {
  try {
    const response = await axios.get(
      `${EXERCISEDB_API_URL}/exercises/targetList`,
      {
        headers: {
          "X-RapidAPI-Key": EXERCISEDB_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    res.status(200).json({
      success: true,
      types: response.data,
    });
  } catch (error) {
    console.error("Error fetching exercise types:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise types",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Get exercises by body part
 * GET /api/exercises/bodypart/:bodyPart
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/bodypart/:bodyPart", verifyClerkJWT, async (req, res) => {
  try {
    const bodyPart = req.params.bodyPart;

    const response = await axios.get(
      `${EXERCISEDB_API_URL}/exercises/bodyPart/${bodyPart}`,
      {
        headers: {
          "X-RapidAPI-Key": EXERCISEDB_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    // Transform the response to match our Exercise schema
    const exercises = response.data.map((ex) => ({
      name: ex.name,
      description: ex.instructions ? ex.instructions.join(" ") : "",
      durationMinutes: 5, // Default duration
      sets: 3, // Default sets
      reps: 10, // Default reps
      restSeconds: 60, // Default rest time
      imageUrl: ex.gifUrl,
      videoUrl: null,
      exerciseDbId: ex.id,
      muscle: ex.bodyPart,
      equipment: ex.equipment,
    }));

    res.status(200).json({
      success: true,
      exercises,
    });
  } catch (error) {
    console.error("Error fetching exercises by body part:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});
// Make sure to export the router
module.exports = router;
