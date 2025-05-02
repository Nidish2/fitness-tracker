// seedPlans.js
require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("../models/Plan");

// Database connection with improved error logging
console.log("Attempting to connect to MongoDB...");
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    seedDatabase();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample workout plans
const workoutPlans = [
  {
    name: "Beginner 10-Day Starter",
    description: "A gentle introduction to fitness for absolute beginners",
    intensity: "low",
    duration: "10 days", // Note: case sensitivity matters for filtering
    targetAgeMin: 16,
    targetAgeMax: 70,
    targetGender: "all",
    daysPerWeek: 3,
    isActive: true,
    exercises: [
      {
        name: "Walking",
        description: "Light walking to get your heart rate up",
        durationMinutes: 15,
        sets: 1,
        restSeconds: 0,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Bodyweight Squats",
        description: "Simple squats using just your bodyweight",
        durationMinutes: 5,
        sets: 2,
        reps: 10,
        restSeconds: 60,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Push-ups (Modified)",
        description: "Push-ups on knees for beginners",
        durationMinutes: 5,
        sets: 2,
        reps: 8,
        restSeconds: 60,
        imageUrl: "https://via.placeholder.com/300",
      },
    ],
  },
  {
    name: "30-Day Muscle Builder",
    description: "Moderate intensity program to build muscle and strength",
    intensity: "moderate",
    duration: "30 days",
    targetAgeMin: 18,
    targetAgeMax: 50,
    targetGender: "all",
    daysPerWeek: 4,
    isActive: true,
    exercises: [
      {
        name: "Bench Press",
        description: "Classic chest exercise with barbell",
        durationMinutes: 10,
        sets: 3,
        reps: 8,
        restSeconds: 90,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Deadlifts",
        description: "Compound exercise for back and legs",
        durationMinutes: 10,
        sets: 3,
        reps: 8,
        restSeconds: 120,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Pull-ups",
        description: "Upper body exercise for back and arms",
        durationMinutes: 8,
        sets: 3,
        reps: 6,
        restSeconds: 90,
        imageUrl: "https://via.placeholder.com/300",
      },
    ],
  },
  {
    name: "6-Month Marathon Prep",
    description: "Long-term plan to prepare for a marathon",
    intensity: "tough",
    duration: "6 months",
    targetAgeMin: 20,
    targetAgeMax: 55,
    targetGender: "all",
    daysPerWeek: 5,
    isActive: true,
    exercises: [
      {
        name: "Interval Running",
        description: "High intensity interval training for cardio",
        durationMinutes: 30,
        sets: 5,
        restSeconds: 120,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Long Distance Run",
        description: "Building endurance with longer runs",
        durationMinutes: 60,
        sets: 1,
        restSeconds: 0,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Hill Sprints",
        description: "Sprinting uphill for power and endurance",
        durationMinutes: 20,
        sets: 8,
        restSeconds: 90,
        imageUrl: "https://via.placeholder.com/300",
      },
    ],
  },
  {
    name: "Women's Beginner Strength",
    description: "Female-focused beginner strength training program",
    intensity: "low",
    duration: "30 days",
    targetAgeMin: 18,
    targetAgeMax: 60,
    targetGender: "female",
    daysPerWeek: 3,
    isActive: true,
    exercises: [
      {
        name: "Dumbbell Rows",
        description: "Upper back exercise with dumbbells",
        durationMinutes: 8,
        sets: 3,
        reps: 12,
        restSeconds: 60,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Glute Bridges",
        description: "Lower body exercise for glutes",
        durationMinutes: 8,
        sets: 3,
        reps: 15,
        restSeconds: 60,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Dumbbell Shoulder Press",
        description: "Shoulder strengthening with dumbbells",
        durationMinutes: 8,
        sets: 3,
        reps: 10,
        restSeconds: 60,
        imageUrl: "https://via.placeholder.com/300",
      },
    ],
  },
  {
    name: "Men's Bulk Up",
    description: "High-intensity program for building muscle mass",
    intensity: "tough",
    duration: "30 days",
    targetAgeMin: 18,
    targetAgeMax: 45,
    targetGender: "male",
    daysPerWeek: 5,
    isActive: true,
    exercises: [
      {
        name: "Barbell Squats",
        description: "Heavy lower body compound exercise",
        durationMinutes: 12,
        sets: 4,
        reps: 6,
        restSeconds: 120,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Barbell Bench Press",
        description: "Heavy chest press for strength",
        durationMinutes: 12,
        sets: 4,
        reps: 6,
        restSeconds: 120,
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        name: "Bent Over Rows",
        description: "Back strengthening exercise with barbell",
        durationMinutes: 12,
        sets: 4,
        reps: 6,
        restSeconds: 120,
        imageUrl: "https://via.placeholder.com/300",
      },
    ],
  },
];

// Seed function - moved to be called only after successful connection
const seedDatabase = async () => {
  try {
    // Verify database connection
    console.log("Database connection state:", mongoose.connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    // Check if plans already exist
    const existingPlansCount = await Plan.countDocuments();
    console.log(`Found ${existingPlansCount} existing plans in the database`);

    // Only clear and reseed if needed
    if (existingPlansCount === 0) {
      console.log("No existing plans found, seeding database...");

      // Insert new plans
      const createdPlans = await Plan.insertMany(workoutPlans);
      console.log(`${createdPlans.length} workout plans seeded successfully`);
    } else {
      console.log("Plans already exist in database, no need to seed");
    }

    // Close connection after seeding
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error during database operations:", error);
    mongoose.connection.close();
  }
};

// Note: We don't call seedDatabase() here, it's called after successful connection
