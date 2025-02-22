const { clerkClient } = require("@clerk/clerk-sdk-node");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await clerkClient.users.createUser({
      emailAddress: email, // Clerk expects "emailAddress"
      password,
    });
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Note: Clerk may not support creating sessions server-side in this manner.
    // Check Clerk's docs for the recommended approach.
    const session = await clerkClient.sessions.createSession({
      emailAddress: email,
      password,
    });
    res.status(200).json({ session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
