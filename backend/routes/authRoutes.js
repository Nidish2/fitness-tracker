const express = require("express");
const router = express.Router();
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

router.get("/protected", ClerkExpressWithAuth(), async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const clerkId = req.auth.userId;
    console.log("Protected route accessed with clerkId:", clerkId);

    let user = await User.findOne({ clerkId });
    if (!user) {
      console.log("User not found, creating new user with clerkId:", clerkId);
      user = new User({
        clerkId,
        name: req.auth.user?.firstName || null,
      });
      await user.save();
      console.log("New user created:", user._id);
      return res.json({
        message: "New user created successfully",
        user: { id: user._id, clerkId: user.clerkId, name: user.name },
      });
    }

    console.log("Existing user found:", user._id);
    res.json({
      message: "Protected route accessed successfully",
      user: { id: user._id, clerkId: user.clerkId, name: user.name },
    });
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
