const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    // Additional fields for Phase 3
    age: {
      type: Number,
    },
    height: {
      type: Number, // in cm
    },
    weight: {
      type: Number, // in kg
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    selectedPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
