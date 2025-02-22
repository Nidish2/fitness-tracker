const { clerkClient } = require("@clerk/clerk-sdk-node");
// const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
