import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to handle token
apiClient.interceptors.request.use(
  async (config) => {
    // Token will be added dynamically for each request
    return config;
  },
  (error) => Promise.reject(error)
);

const userService = {
  saveUserDetails: async (details, token) => {
    try {
      const response = await apiClient.post("/user/details", details, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error saving user details:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getUserDetails: async (token) => {
    try {
      const response = await apiClient.get("/user/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // Better error handling with fallback
      if (error.response && error.response.status === 404) {
        // User not found is expected for new users
        return null;
      }
      console.error(
        "Error fetching user details:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default userService;
