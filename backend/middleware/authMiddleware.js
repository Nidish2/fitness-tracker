// middlewares/authMiddleware.js
const { verifyToken } = require("@clerk/clerk-sdk-node");

const authMiddleware = async (req, res, next) => {
  try {
    // Expecting "Bearer <token>" in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing authorization header" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
