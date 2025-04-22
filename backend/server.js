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

// //for deployment

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// // Add your API routes here (e.g., app.get('/api/...'))
// // Example: app.get('/api/test', (req, res) => res.send('API is working'));

// // Catch-all route to serve the frontend's index.html for client-side routing
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// //for local development

// Set up CORS properly to allow frontend requests
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL ||
          "https://fitness-tracker-6u4k.onrender.com"
        : "http://localhost:5173", // Vite's default port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Ensure each route is properly exported as a router before using it
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/exercises", exercisesRoutes);
// app.use("/api/googlefit", googleFitRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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
});
