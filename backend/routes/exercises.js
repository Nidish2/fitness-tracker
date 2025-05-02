const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const exerciseController = require("../controller/exercise");

// Debug logging to check if functions are defined
console.log(
  "authenticate:",
  typeof authenticate === "function" ? "Function defined" : authenticate
);
console.log(
  "exerciseController.getExercises:",
  typeof exerciseController.getExercises === "function"
    ? "Function defined"
    : exerciseController.getExercises
);

// Get exercises with optional filters
router.get("/", authenticate, exerciseController.getExercises);

// Get a single exercise by ID
router.get("/:id", authenticate, exerciseController.getExerciseById);

// Get all body parts for filtering
router.get(
  "/categories/bodyparts",
  authenticate,
  exerciseController.getBodyParts
);

// Get all exercise types for filtering
router.get(
  "/categories/types",
  authenticate,
  exerciseController.getExerciseTypes
);

// Get exercises by body part
router.get(
  "/bodypart/:bodyPart",
  authenticate,
  exerciseController.getExercisesByBodyPart
);

module.exports = router;
