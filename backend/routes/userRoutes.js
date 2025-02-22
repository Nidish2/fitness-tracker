const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// POST: Save user details
router.post("/details", authMiddleware, userController.saveUserDetails);
// GET: Fetch user details
router.get("/details", authMiddleware, userController.getUserDetails);

module.exports = router;
