// src/services/userService.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Service for user-related API calls
 */
const userService = {
  /**
   * Fetches user details from the API
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} User details object
   */
  getUserDetails: async (token) => {
    try {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await fetch(`${API_URL}/users/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK before trying to parse it
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("getUserDetails error:", error);
      // Rethrow to allow component to handle error
      throw error;
    }
  },

  /**
   * Saves user details to the API
   * @param {Object} data - User details to save
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Response object
   */
  saveUserDetails: async (data, token) => {
    try {
      if (!token) {
        throw new Error("Authentication token is required");
      }

      if (!data) {
        throw new Error("User data is required");
      }

      // Log the data being sent for debugging
      console.log("Sending user data:", JSON.stringify(data));

      // Make sure we have a userId in the data
      if (!data.userId && typeof window !== "undefined") {
        // Try to get the user ID from localStorage as a fallback
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.id) {
          data.userId = storedUser.id;
        }
      }

      // Ensure data validation before sending to server
      const validatedData = validateUserData(data);

      const response = await fetch(`${API_URL}/users/details`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      // Check response status first
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          // Try to parse as JSON
          const errorJson = JSON.parse(errorText);
          errorMessage =
            errorJson.message || `Server error: ${response.status}`;
        } catch (e) {
          // If not valid JSON, use text
          errorMessage = errorText || `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Parse response
      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      console.error("saveUserDetails error:", error);

      // Handle network errors specially
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }

      if (!navigator.onLine) {
        throw new Error(
          "network error: You appear to be offline. Please check your connection."
        );
      }

      // Rethrow to allow component to handle error
      throw error;
    }
  },
};

/**
 * Validates user data before sending to server
 * @param {Object} data - User data to validate
 * @returns {Object} - Validated user data
 */
function validateUserData(data) {
  const validatedData = { ...data };

  // Ensure name is a string and trimmed
  if (typeof validatedData.name === "string") {
    validatedData.name = validatedData.name.trim();
  } else {
    validatedData.name = "";
  }

  // Ensure numeric fields are numbers
  ["age", "height", "weight"].forEach((field) => {
    if (validatedData[field] !== undefined) {
      // Convert to number, defaulting to 0 if invalid
      const num = Number(validatedData[field]);
      validatedData[field] = isNaN(num) ? 0 : num;
    }
  });

  return validatedData;
}

export default userService;
