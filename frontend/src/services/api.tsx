// src/services/api.tsx
import axios, { AxiosResponse } from "axios";

// Add type declaration for Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken(): Promise<string>;
      };
    };
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface User {
  id: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  user: T;
}

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error setting auth token:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<User>>) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Unknown error occurred";
    console.error("API Error:", errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

const apiService = {
  // User registration
  registerUser: async (userId: string): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>("/auth/register", {
      userId,
    });
    return response.data.user;
  },

  // Get user by clerk ID
  getUser: async (clerkId: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/auth/${clerkId}`);
    return response.data.user;
  },

  // Update user profile
  updateUserProfile: async (
    clerkId: string,
    profileData: Partial<User>
  ): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${clerkId}`,
      profileData
    );
    return response.data.user;
  },
};

export default apiService;
