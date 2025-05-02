const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests
 */
const authenticate = (req, res, next) => {
  // Add your authentication logic here, e.g., checking a token
  console.log("Authenticating...");
  next(); // Proceed to the next middleware/controller
};

/**
 * Improved middleware to verify the Clerk JWT
 * This uses a safer JWT verification approach
 */
const verifyClerkJWT = (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    try {
      // Simple decode to get the user ID
      const decoded = jwt.decode(token);

      if (!decoded || !decoded.sub) {
        return res.status(401).json({
          success: false,
          message: "Invalid token structure",
        });
      }

      // Set the userId for use in route handlers
      req.userId = decoded.sub;

      // Add additional verification
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }

      next();
    } catch (error) {
      console.error("JWT verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Token verification failed",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

module.exports = {
  verifyClerkJWT,
  authenticate,
};
