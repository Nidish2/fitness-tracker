const { verifyToken } = require("@clerk/clerk-sdk-node");

const authMiddleware = async (req, res, next) => {
  try {
    // Expecting "Bearer <token>" in the authorization header
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
