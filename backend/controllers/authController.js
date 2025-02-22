// controllers/authController.js
const { clerkClient } = require("@clerk/clerk-sdk-node");
// If you wish to store additional user data in MongoDB, import your User model:
// const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Create the user with Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: email,
      password,
    });

    // Optionally, store the user in your MongoDB
    // const newUser = new User({
    //   clerkId: clerkUser.id,
    //   email: clerkUser.emailAddresses[0].emailAddress,
    //   // ... any other fields you want to track
    // });
    // await newUser.save();

    res.status(201).json({ user: clerkUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Protected endpoint to return the user details after verifying the Clerk token
exports.getUser = async (req, res) => {
  try {
    // The authMiddleware has already verified the token and attached decoded info to req.user.
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
