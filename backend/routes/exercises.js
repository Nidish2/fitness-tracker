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

// Make sure to export the router
module.exports = router;
