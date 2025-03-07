const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const authMiddleware = ClerkExpressWithAuth({
  // This properly sets up Clerk authentication verification
  // and adds the auth object to the request
  authorizedParties: [
    process.env.CLERK_ALLOWED_ORIGIN || "http://localhost:3000",
  ],
});

// Our custom middleware that uses Clerk's auth object
const validateUser = (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Set the clerkId on the request object for controllers to use
    req.user = { id: req.auth.userId };
    next();
  } catch (error) {
    console.error("Auth validation error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

// Combined middleware for protected routes
const protectRoute = [authMiddleware, validateUser];

module.exports = protectRoute;
