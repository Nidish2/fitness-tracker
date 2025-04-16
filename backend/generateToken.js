// generateToken.js
const { createClerkClient } = require("@clerk/clerk-sdk-node");
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function generateToken(userId) {
  try {
    // Create a sign-in token for the user
    const { token: signInToken } = await clerk.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 3600,
    });

    // Create session using the sign-in token
    const session = await clerk.sessions.create({
      sessionToken: signInToken,
      userId,
    });

    console.log("Session Token:", session.sessionToken);
  } catch (error) {
    console.error("Error generating token:", error.message);
  }
}

// Replace with your User ID from Clerk Dashboard
generateToken("user_2tS7eVAszLEBK8jgPwbupOaNkYo");
