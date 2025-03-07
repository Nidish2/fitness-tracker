const express = require("express");
const router = express.Router();
const {
  saveUserDetails,
  getUserDetails,
} = require("../controllers/userController");
const protectRoute = require("../middleware/authMiddleware");

// Use the combined middleware array
router.post("/details", protectRoute, saveUserDetails);
router.get("/details", protectRoute, getUserDetails);

module.exports = router;
