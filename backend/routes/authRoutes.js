const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Since Clerk handles signup on the client side, we only need protected routes.
router.get("/me", authMiddleware, authController.getUser);

module.exports = router;
