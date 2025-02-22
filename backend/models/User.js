const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk user ID
  name: { type: String, required: true },
  age: { type: Number, required: true },
  height: { type: Number, required: true }, // in centimeters
  weight: { type: Number, required: true }, // in kilograms
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
