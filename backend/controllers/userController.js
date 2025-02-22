const User = require("../models/User");

exports.saveUserDetails = async (req, res) => {
  try {
    const { name, age, height, weight } = req.body;
    const clerkId = req.user.id; // Set by authMiddleware from Clerk

    let user = await User.findOne({ clerkId });
    if (user) {
      // Update existing user
      user.name = name;
      user.age = age;
      user.height = height;
      user.weight = weight;
      user.updatedAt = Date.now();
    } else {
      // Create new user
      user = new User({ clerkId, name, age, height, weight });
    }

    await user.save();
    res.status(200).json({ message: "User details saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save user details" });
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
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};
