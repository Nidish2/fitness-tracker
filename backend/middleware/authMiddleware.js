// Modified authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. No valid token provided.",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Better handling of the public key
      let CLERK_PEM_PUBLIC_KEY = process.env.CLERK_PEM_PUBLIC_KEY;

      if (!CLERK_PEM_PUBLIC_KEY) {
        console.error("Missing CLERK_PEM_PUBLIC_KEY in environment variables");
        return res.status(500).json({
          message: "Server configuration error - missing public key",
          success: false,
        });
      }

      // Ensure proper formatting of the key
      if (CLERK_PEM_PUBLIC_KEY.includes("\\n")) {
        CLERK_PEM_PUBLIC_KEY = CLERK_PEM_PUBLIC_KEY.replace(/\\n/g, "\n");
      }
      console.log("Verifying token...");
      const decoded = jwt.verify(token, CLERK_PEM_PUBLIC_KEY, {
        algorithms: ["RS256"],
      });
      console.log("Token verified successfully:", decoded);

      // Check for user ID in the token
      if (!decoded.sub) {
        return res.status(401).json({
          message: "Invalid token format: missing user ID",
          success: false,
        });
      }

      // Set user object in the request
      req.user = {
        id: decoded.sub, // This is the clerkId
        email: decoded.email || null,
        name: decoded.name || null,
      };

      next();
    } catch (error) {
      console.error("Token verification error:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
          success: false,
        });
      }

      return res.status(401).json({
        message: "Token verification failed: " + error.message,
        success: false,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Internal server error during authentication",
      success: false,
    });
  }
};

module.exports = authMiddleware;
