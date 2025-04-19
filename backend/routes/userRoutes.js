// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Add auth middleware to all user routes
router.get("/details", authMiddleware, userController.getUserDetails);
router.post("/details", authMiddleware, userController.updateUserDetails);

module.exports = router;
