const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    height: {
      type: Number,
      required: true,
      min: 1,
      max: 300, // cm
      comment: "Height in centimeters",
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
      max: 500, // kg
      comment: "Weight in kilograms",
    },
    // Additional fitness-related fields (optional)
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "moderate",
    },
    weightHistory: [
      {
        weight: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    fitnessGoals: {
      type: [String],
      default: [],
    },
    healthConditions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for BMI calculation
userSchema.virtual("bmi").get(function () {
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Method to add weight history entry
userSchema.methods.addWeightRecord = function (weight) {
  this.weightHistory.push({ weight, date: new Date() });

  // Keep only the latest 100 entries
  if (this.weightHistory.length > 100) {
    this.weightHistory = this.weightHistory.slice(-100);
  }

  return this.save();
};

// Make the virtuals available when converting to JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
