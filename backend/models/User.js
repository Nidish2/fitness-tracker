const mongoose = require("mongoose");

const weightHistorySchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
  },
  height: {
    type: Number,
    min: 1,
    max: 300,
  }, // in cm
  weight: {
    type: Number,
    min: 1,
    max: 500,
  }, // in kg
  weightHistory: [weightHistorySchema],
  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active", "very active"],
    default: "moderate",
  },
  fitnessGoals: {
    type: [String],
    default: [],
  },
  healthConditions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual("bmi").get(function () {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return this.weight / (heightInMeters * heightInMeters);
  }
  return null;
});

userSchema.methods.addWeightRecord = async function (weight) {
  const lastRecord =
    this.weightHistory.length > 0
      ? this.weightHistory[this.weightHistory.length - 1]
      : null;

  if (!lastRecord || lastRecord.weight !== weight) {
    this.weight = weight;
    this.weightHistory.push({ weight, date: new Date() });
  }

  return this.weightHistory;
};

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
