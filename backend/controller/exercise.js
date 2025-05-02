// Import necessary modules
const axios = require("axios");

// Environment variables
const EXERCISEDB_API_KEY = process.env.EXERCISEDB_API_KEY;
const EXERCISEDB_BASE_URL = "https://exercisedb.p.rapidapi.com";

// Helper function to make requests to ExerciseDB API
const exerciseDbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${EXERCISEDB_BASE_URL}${endpoint}`, {
      headers: {
        "X-RapidAPI-Key": EXERCISEDB_API_KEY,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ExerciseDB API: ${error.message}`);
    throw new Error(`ExerciseDB API Error: ${error.message}`);
  }
};

// Get exercises with filters
exports.getExercises = async (req, res) => {
  try {
    const { type, muscle, difficulty } = req.query;
    let exercises = await exerciseDbRequest("/exercises");

    // Apply filters
    if (type) {
      exercises = exercises.filter(
        (ex) => ex.type?.toLowerCase() === type.toLowerCase()
      );
    }

    if (muscle) {
      exercises = exercises.filter(
        (ex) => ex.muscle?.toLowerCase() === muscle.toLowerCase()
      );
    }

    if (difficulty) {
      exercises = exercises.filter(
        (ex) => ex.difficulty?.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Map exercises to our preferred format
    const mappedExercises = exercises.map((ex) => ({
      name: ex.name,
      description: ex.instructions?.join("\n") || "",
      durationMinutes: 5, // Default value
      sets: ex.sets || 3, // Default value
      reps: ex.reps || 10, // Default value
      restSeconds: 60, // Default value
      imageUrl: ex.gifUrl || "",
      videoUrl: null,
      exerciseDbId: ex.id,
      muscle: ex.bodyPart || ex.muscle,
      equipment: ex.equipment,
      difficulty: ex.difficulty || "intermediate",
    }));

    res.json({ exercises: mappedExercises });
  } catch (error) {
    console.error(`Error getting exercises: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get a single exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await exerciseDbRequest(`/exercises/exercise/${id}`);

    // Map to our preferred format
    const mappedExercise = {
      name: exercise.name,
      description: exercise.instructions?.join("\n") || "",
      durationMinutes: 5, // Default value
      sets: exercise.sets || 3, // Default value
      reps: exercise.reps || 10, // Default value
      restSeconds: 60, // Default value
      imageUrl: exercise.gifUrl || "",
      videoUrl: null,
      exerciseDbId: exercise.id,
      muscle: exercise.bodyPart || exercise.muscle,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty || "intermediate",
    };

    res.json({ exercise: mappedExercise });
  } catch (error) {
    console.error(`Error getting exercise by ID: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get all body parts (for filtering)
exports.getBodyParts = async (req, res) => {
  try {
    const bodyParts = await exerciseDbRequest("/exercises/bodyPartList");
    res.json({ bodyParts });
  } catch (error) {
    console.error(`Error getting body parts: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get all exercise types (for filtering)
exports.getExerciseTypes = async (req, res) => {
  try {
    const exercises = await exerciseDbRequest("/exercises");
    const types = [...new Set(exercises.map((ex) => ex.type))].filter(Boolean);
    res.json({ types });
  } catch (error) {
    console.error(`Error getting exercise types: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Get exercises by body part
exports.getExercisesByBodyPart = async (req, res) => {
  try {
    const { bodyPart } = req.params;
    const exercises = await exerciseDbRequest(
      `/exercises/bodyPart/${bodyPart}`
    );

    // Map exercises to our preferred format
    const mappedExercises = exercises.map((ex) => ({
      name: ex.name,
      description: ex.instructions?.join("\n") || "",
      durationMinutes: 5,
      sets: ex.sets || 3,
      reps: ex.reps || 10,
      restSeconds: 60,
      imageUrl: ex.gifUrl || "",
      videoUrl: null,
      exerciseDbId: ex.id,
      muscle: ex.bodyPart || ex.muscle,
      equipment: ex.equipment,
      difficulty: ex.difficulty || "intermediate",
    }));

    res.json({ exercises: mappedExercises });
  } catch (error) {
    console.error(`Error getting exercises by body part: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
