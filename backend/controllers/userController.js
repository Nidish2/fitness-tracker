// userController.js
const User = require("../models/User");

exports.getUserDetails = async (req, res) => {
  try {
    // The user is now available from the auth middleware
    const user = req.mongoUser;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Return user data
    res.status(200).json({
      clerkId: user.clerkId,
      name: user.name,
      age: user.age,
      height: user.height,
      weight: user.weight,
      bmi: user.bmi,
      weightHistory: user.weightHistory || [],
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    // The user is now available from the auth middleware
    let user = req.mongoUser;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const { name, age, height, weight } = req.body;

    // Update user details
    user.name = name || user.name;
    user.age = age || user.age;
    user.height = height || user.height;

    // Update weight and weight history
    if (weight) {
      // Add to weight history if it changed
      if (!user.weight || user.weight !== weight) {
        if (!user.weightHistory) {
          user.weightHistory = [];
        }

        user.weightHistory.push({
          weight,
          date: new Date(),
        });
      }

      user.weight = weight;
    }

    // Calculate BMI if height and weight are available
    if (user.height && user.weight) {
      // BMI = weight(kg) / (height(m))²
      const heightInMeters = user.height / 100;
      user.bmi = user.weight / (heightInMeters * heightInMeters);
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "User details updated successfully",
      success: true,
      user: {
        clerkId: user.clerkId,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        weightHistory: user.weightHistory || [],
      },
    });
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};
