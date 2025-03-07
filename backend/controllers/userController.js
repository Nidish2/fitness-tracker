const User = require("../models/User");

exports.saveUserDetails = async (req, res) => {
  try {
    const {
      name,
      age,
      height,
      weight,
      activityLevel,
      fitnessGoals,
      healthConditions,
    } = req.body;
    const clerkId = req.user.id; // Set by authMiddleware from Clerk

    // Validate required fields
    if (!name || !age || !height || !weight) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "Name, age, height, and weight are required",
      });
    }

    // Validate data types and ranges
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (isNaN(age) || age <= 0 || age > 120) {
      return res
        .status(400)
        .json({ error: "Invalid age (must be between 1-120)" });
    }

    if (isNaN(height) || height <= 0 || height > 300) {
      return res
        .status(400)
        .json({ error: "Invalid height (must be between 1-300 cm)" });
    }

    if (isNaN(weight) || weight <= 0 || weight > 500) {
      return res
        .status(400)
        .json({ error: "Invalid weight (must be between 1-500 kg)" });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      // Track weight history if weight changed
      if (user.weight !== weight) {
        user.weightHistory.push({
          weight,
          date: new Date(),
        });
      }

      // Update existing user
      user.name = name;
      user.age = age;
      user.height = height;
      user.weight = weight;

      // Update optional fields if provided
      if (activityLevel) user.activityLevel = activityLevel;
      if (fitnessGoals) user.fitnessGoals = fitnessGoals;
      if (healthConditions) user.healthConditions = healthConditions;
    } else {
      // Create new user
      user = new User({
        clerkId,
        name,
        age,
        height,
        weight,
        weightHistory: [{ weight, date: new Date() }],
      });

      // Set optional fields if provided
      if (activityLevel) user.activityLevel = activityLevel;
      if (fitnessGoals) user.fitnessGoals = fitnessGoals;
      if (healthConditions) user.healthConditions = healthConditions;
    }

    await user.save();

    res.status(200).json({
      message: "User details saved successfully",
      user: {
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
      },
    });
  } catch (error) {
    console.error("saveUserDetails error:", error);
    res
      .status(500)
      .json({ error: "Failed to save user details", message: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const clerkId = req.user.id;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getUserDetails error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user details", message: error.message });
  }
};

// New endpoint to add a weight history record
exports.addWeightRecord = async (req, res) => {
  try {
    const { weight } = req.body;
    const clerkId = req.user.id;

    if (!weight || isNaN(weight) || weight <= 0 || weight > 500) {
      return res
        .status(400)
        .json({ error: "Invalid weight (must be between 1-500 kg)" });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.addWeightRecord(weight);

    res.status(200).json({
      message: "Weight record added successfully",
      weightHistory: user.weightHistory,
    });
  } catch (error) {
    console.error("addWeightRecord error:", error);
    res
      .status(500)
      .json({ error: "Failed to add weight record", message: error.message });
  }
};

// New endpoint to get user's weight history
exports.getWeightHistory = async (req, res) => {
  try {
    const clerkId = req.user.id;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ weightHistory: user.weightHistory });
  } catch (error) {
    console.error("getWeightHistory error:", error);
    res.status(500).json({
      error: "Failed to fetch weight history",
      message: error.message,
    });
  }
};
