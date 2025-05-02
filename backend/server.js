require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Fix the import - make sure to use the correct path and casing
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const plansRoutes = require("./routes/plans");
const exercisesRoutes = require("./routes/exercises");
// Add this with the other route imports in server.js
// const googleFitRoutes = require("./routes/googleFit");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "fitness-tracker-secret"));

// Improved CORS configuration - Make sure to allow your Firebase domain
app.use(
  cors({
    origin: [
      // Allow requests from these origins
      process.env.FRONTEND_URL || "https://trackfit-6bf6f.web.app", // Your Firebase hosting URL
      "https://fitness-tracker-6u4k.onrender.com",
      "http://localhost:5173", // Vite's default port for development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// For deployment - serve static files if needed
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Connect to MongoDB with improved error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// API Routes - make sure all are properly exported as routers
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/exercises", exercisesRoutes);
// app.use("/api/googlefit", googleFitRoutes); // Uncommented this route

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Server error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(
    `CORS origins: ${
      process.env.FRONTEND_URL || "https://trackfit-6bf6f.web.app"
    }`
  );
});
