// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true, // Add index for faster queries
      unique: true, // Ensure unique userId
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      max: [120, "Age cannot exceed 120"],
      required: [true, "Age is required"],
    },
    height: {
      type: Number,
      min: [1, "Height must be at least 1 cm"],
      max: [300, "Height cannot exceed 300 cm"],
      required: [true, "Height is required"],
    },
    weight: {
      type: Number,
      min: [1, "Weight must be at least 1 kg"],
      max: [500, "Weight cannot exceed 500 kg"],
      required: [true, "Weight is required"],
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very active"],
      default: "moderate",
    },
    fitnessGoals: {
      type: [String],
      enum: ["weight loss", "muscle gain", "maintenance", "endurance"],
    },
    healthConditions: {
      type: [String],
    },
    lastMenstrualPeriod: {
      type: Date,
      required: function () {
        return this.gender === "female";
      },
    },
    averageCycleLength: {
      type: Number,
      min: [21, "Cycle length must be at least 21 days"],
      max: [35, "Cycle length cannot exceed 35 days"],
      required: function () {
        return this.gender === "female";
      },
    },
    weightHistory: [
      {
        weight: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware to update the updatedAt field
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add virtual field for BMI calculation
UserSchema.virtual("bmi").get(function () {
  if (!this.height || !this.weight) return null;
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Add method to check if user data needs to be updated
UserSchema.methods.needsUpdate = function (newData) {
  return (
    this.name !== newData.name ||
    this.age !== newData.age ||
    this.height !== newData.height ||
    this.weight !== newData.weight
  );
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
