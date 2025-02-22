// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
// Protected route: the client must send a valid token in the Authorization header.
router.get("/me", authMiddleware, authController.getUser);

module.exports = router;
