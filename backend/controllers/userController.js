const User = require("../models/User");

exports.getUserDetails = async (req, res) => {
  try {
    // Enhanced logging for debugging
    console.log("getUserDetails called with clerkId:", req.user.id);
    console.log("Request headers:", req.headers);

    // Find user by the Clerk ID
    let user = await User.findOne({ clerkId: req.user.id });

    if (!user) {
      console.log(
        "User not found in database, creating new user for clerkId:",
        req.user.id
      );

      // Create a new user if not found
      user = new User({
        clerkId: req.user.id,
        name: req.user.name || null,
      });

      try {
        await user.save();
        console.log("New user created with ID:", user._id);
      } catch (saveError) {
        console.error("Error saving new user:", saveError);
        return res.status(500).json({
          message: "Error creating new user",
          error: saveError.message,
          success: false,
        });
      }

      return res.json(user);
    }

    console.log("User found:", user._id);
    res.json(user);
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
    const { name, age, height, weight } = req.body;
    const clerkId = req.user.id;

    console.log("updateUserDetails called with:", {
      name,
      age,
      height,
      weight,
      clerkId,
    });

    // Validate inputs
    if (!name || !age || !height || !weight) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (isNaN(age) || isNaN(height) || isNaN(weight)) {
      return res.status(400).json({
        message: "Age, height, and weight must be valid numbers",
        success: false,
      });
    }

    // Find user by Clerk ID
    let user = await User.findOne({ clerkId: clerkId });

    if (!user) {
      console.log(
        "User not found in updateUserDetails, creating new user with clerkId:",
        clerkId
      );

      // Create new user if not exists
      user = new User({
        clerkId: clerkId,
        name,
        age,
        height,
        weight,
      });

      // Add initial weight record
      try {
        await user.addWeightRecord(weight);
      } catch (weightError) {
        console.error("Error adding weight record:", weightError);
      }
    } else {
      console.log("Updating existing user:", user._id);

      // Update existing user
      user.name = name;
      user.age = age;
      user.height = height;

      // This will update weight and add to history if changed
      try {
        await user.addWeightRecord(weight);
      } catch (weightError) {
        console.error("Error updating weight record:", weightError);
      }
    }

    try {
      await user.save();
      console.log("User saved successfully:", user._id);
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res.status(500).json({
        message: "Error saving user details",
        error: saveError.message,
        success: false,
      });
    }

    res.json({
      user,
      success: true,
      message: "User details updated successfully",
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
