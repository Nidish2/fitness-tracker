const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const User = require("../models/User");
const { verifyClerkJWT } = require("../middleware/auth");

// Google OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes required for Google Fit API
const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.location.read",
];

/**
 * Generate authorization URL for Google Fit
 * GET /api/googlefit/auth
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/auth", verifyClerkJWT, async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", // Get refresh token
      scope: SCOPES,
      // Store the user's ID in the state parameter
      state: req.userId,
    });

    res.status(200).json({
      success: true,
      authUrl: url,
    });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate authorization URL",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Callback endpoint for Google OAuth
 * GET /api/googlefit/callback
 */
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Update the user with the tokens
    const user = await User.findOne({ clerkId: state });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Store tokens in user document
    user.googleFitTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    };

    await user.save();

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?googlefit=success`);
  } catch (error) {
    console.error("Error handling Google callback:", error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?googlefit=error`);
  }
});

/**
 * Fetch user's steps data from Google Fit
 * GET /api/googlefit/steps
 * Headers: Authorization: Bearer <clerk_jwt>
 * Query params: startDate, endDate (ISO format)
 */
router.get("/steps", verifyClerkJWT, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    // Find user and check if has Google Fit tokens
    const user = await User.findOne({ clerkId: req.userId });

    if (!user || !user.googleFitTokens || !user.googleFitTokens.access_token) {
      return res.status(401).json({
        success: false,
        message: "Google Fit not connected",
        needsAuth: true,
      });
    }

    // Set the tokens
    oauth2Client.setCredentials(user.googleFitTokens);

    // Create Fitness client
    const fitness = google.fitness({
      version: "v1",
      auth: oauth2Client,
    });

    // Parse dates to timestamps
    const startTimeMillis = new Date(startDate).getTime();
    const endTimeMillis = new Date(endDate).getTime();

    // Request steps data
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
            dataSourceId:
              "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    // Process the response
    const stepsData = response.data.bucket.map((bucket) => {
      const startDate = new Date(parseInt(bucket.startTimeMillis));
      const value = bucket.dataset[0].point[0]?.value[0]?.intVal || 0;

      return {
        date: startDate.toISOString().split("T")[0],
        steps: value,
      };
    });

    res.status(200).json({
      success: true,
      stepsData,
    });
  } catch (error) {
    console.error("Error fetching steps data:", error);

    // Handle token expiry
    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Authorization expired",
        needsAuth: true,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch steps data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Fetch user's calories data from Google Fit
 * GET /api/googlefit/calories
 * Headers: Authorization: Bearer <clerk_jwt>
 * Query params: startDate, endDate (ISO format)
 */
router.get("/calories", verifyClerkJWT, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    // Find user and check if has Google Fit tokens
    const user = await User.findOne({ clerkId: req.userId });

    if (!user || !user.googleFitTokens || !user.googleFitTokens.access_token) {
      return res.status(401).json({
        success: false,
        message: "Google Fit not connected",
        needsAuth: true,
      });
    }

    // Set the tokens
    oauth2Client.setCredentials(user.googleFitTokens);

    // Create Fitness client
    const fitness = google.fitness({
      version: "v1",
      auth: oauth2Client,
    });

    // Parse dates to timestamps
    const startTimeMillis = new Date(startDate).getTime();
    const endTimeMillis = new Date(endDate).getTime();

    // Request calories data
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataTypeName: "com.google.calories.expended",
            dataSourceId:
              "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    // Process the response
    const caloriesData = response.data.bucket.map((bucket) => {
      const startDate = new Date(parseInt(bucket.startTimeMillis));
      const value = bucket.dataset[0].point[0]?.value[0]?.fpVal || 0;

      return {
        date: startDate.toISOString().split("T")[0],
        calories: Math.round(value),
      };
    });

    res.status(200).json({
      success: true,
      caloriesData,
    });
  } catch (error) {
    console.error("Error fetching calories data:", error);

    // Handle token expiry
    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Authorization expired",
        needsAuth: true,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch calories data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Check if user has connected Google Fit
 * GET /api/googlefit/status
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.get("/status", verifyClerkJWT, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isConnected = !!(
      user.googleFitTokens && user.googleFitTokens.access_token
    );

    res.status(200).json({
      success: true,
      isConnected,
    });
  } catch (error) {
    console.error("Error checking Google Fit status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check Google Fit connection status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Disconnect Google Fit from user account
 * DELETE /api/googlefit/connection
 * Headers: Authorization: Bearer <clerk_jwt>
 */
router.delete("/connection", verifyClerkJWT, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove Google Fit tokens
    user.googleFitTokens = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Google Fit disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting Google Fit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disconnect Google Fit",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
