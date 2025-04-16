const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Assumes Clerk auth middleware exists
const userController = require("../controllers/userController");

router.get("/details", authMiddleware, userController.getUserDetails);
router.post("/details", authMiddleware, userController.updateUserDetails);

module.exports = router;
