// authMiddleware.js
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/User");

// Use Clerk's middleware for authentication
const authMiddleware = [
  ClerkExpressWithAuth(),
  async (req, res, next) => {
    try {
      // Verify the request has Clerk auth data
      if (!req.auth || !req.auth.userId) {
        return res.status(401).json({
          message: "Authentication required",
          success: false,
        });
      }

      const clerkId = req.auth.userId;

      // Find or create user in the database
      try {
        let user = await User.findOne({ clerkId });

        if (!user) {
          // Create new user if not found
          console.log(`Creating new user with clerkId: ${clerkId}`);
          user = new User({
            clerkId,
            name: req.auth.user?.firstName || null,
          });
          await user.save();
          console.log(`New user created with ID: ${user._id}`);
        }

        // Attach user object to the request
        req.mongoUser = user;

        next();
      } catch (dbError) {
        console.error("Database error in auth middleware:", dbError);
        return res.status(500).json({
          message: "Database error during authentication",
          success: false,
        });
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        message: "Authentication error",
        success: false,
      });
    }
  },
];

module.exports = authMiddleware;
