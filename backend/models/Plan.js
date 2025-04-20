const mongoose = require("mongoose");

// Define a schema for individual exercises within a plan
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  sets: {
    type: Number,
    default: 1,
  },
  reps: {
    type: Number,
  },
  restSeconds: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  // Reference to ExerciseDB if used
  exerciseDbId: {
    type: String,
  },
});

// Define the workout plan schema
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    intensity: {
      type: String,
      enum: ["low", "moderate", "tough"],
      required: true,
    },
    duration: {
      type: String,
      enum: ["10 days", "30 days", "6 months", "1 year"],
      required: true,
    },
    // Target audience
    targetAgeMin: {
      type: Number,
    },
    targetAgeMax: {
      type: Number,
    },
    targetGender: {
      type: String,
      enum: ["male", "female", "all"],
    },
    // Workout schedule
    daysPerWeek: {
      type: Number,
      min: 1,
      max: 7,
    },
    // List of exercises in this plan
    exercises: [exerciseSchema],
    // Keep track of when the plan was created or updated
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
planSchema.index({ intensity: 1 });
planSchema.index({ duration: 1 });
planSchema.index({ targetGender: 1 });
planSchema.index({ targetAgeMin: 1, targetAgeMax: 1 });

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
