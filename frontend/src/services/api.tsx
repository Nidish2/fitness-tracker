// src/services/api.tsx
import axios from "axios";

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
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  fitnessLevel?: string;
  selectedPlanId?: string;
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  intensity: "low" | "moderate" | "tough";
  duration: "10 days" | "30 days" | "6 months" | "1 year";
  targetAgeMin?: number;
  targetAgeMax?: number;
  targetGender?: string;
  daysPerWeek: number;
  exercises: Exercise[] | number;
}

interface Exercise {
  name: string;
  description?: string;
  durationMinutes: number;
  sets?: number;
  reps?: number;
  restSeconds?: number;
  imageUrl?: string;
  videoUrl?: string;
}

interface ApiUserResponse {
  success: boolean;
  message?: string;
  user: User;
}

interface ApiPlanResponse {
  success: boolean;
  message?: string;
  plan: Plan;
}

interface ExerciseFilters {
  type?: string;
  muscle?: string;
  difficulty?: string;
}
// Update this interface to match the actual respons
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
      const token = await getToken();
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
  (response) => response,
  (error) => {
    let errorMessage = "An unknown error occurred";
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      errorMessage =
        "No response received from server. Please check your network connection.";
      console.error("Network Error:", error.request);
    } else {
      errorMessage = error.message || "Error setting up request";
      console.error("Request Error:", error.message);
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// Improved token retrieval function
async function getToken(): Promise<string> {
  try {
    if (!window.Clerk?.session) {
      console.log("Waiting for Clerk session to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    const token = await window.Clerk?.session?.getToken();
    return token || "";
  } catch (error) {
    console.error("Error getting authentication token:", error);
    return "";
  }
}

const apiService = {
  // User registration
  registerUser: async (userId: string): Promise<User> => {
    try {
      const response = await apiClient.post<ApiUserResponse>("/auth/register", {
        userId,
      });
      return response.data.user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // Get user by clerk ID
  getUser: async (clerkId: string): Promise<User> => {
    try {
      const response = await apiClient.get<ApiUserResponse>(`/auth/${clerkId}`);
      return response.data.user;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (
    clerkId: string,
    profileData: Partial<User>
  ): Promise<User> => {
    try {
      const response = await apiClient.put<ApiUserResponse>(
        `/users/${clerkId}`,
        profileData
      );
      return response.data.user;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Get all workout plans - Fixed to handle the actual API response format
  getWorkoutPlans: async (): Promise<Plan[]> => {
    try {
      const response = await apiClient.get<Plan[]>("/plans");

      // Log the raw response for debugging
      console.log("Raw API response:", response.data);

      // The API directly returns an array of plans, not wrapped in a success object
      return response.data;
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      throw error;
    }
  },

  // Get workout plan by ID
  getWorkoutPlanById: async (planId: string): Promise<Plan> => {
    try {
      const response = await apiClient.get<ApiPlanResponse>(`/plans/${planId}`);
      return response.data.plan;
    } catch (error) {
      console.error(`Failed to fetch workout plan with ID ${planId}:`, error);
      throw error;
    }
  },

  // Select a workout plan for the user
  selectWorkoutPlan: async (clerkId: string, planId: string): Promise<User> => {
    try {
      const response = await apiClient.post<ApiUserResponse>(
        `/users/${clerkId}/plan`,
        { planId }
      );
      return response.data.user;
    } catch (error) {
      console.error("Failed to select workout plan:", error);
      throw error;
    }
  },

  // Get user's selected workout plan
  getUserPlan: async (clerkId: string): Promise<Plan> => {
    try {
      const response = await apiClient.get<ApiPlanResponse>(
        `/users/${clerkId}/plan`
      );
      return response.data.plan;
    } catch (error) {
      console.error("Failed to fetch user's plan:", error);
      throw error;
    }
  },

  // Get exercises with optional filters
  getExercises: async (filters: ExerciseFilters = {}) => {
    try {
      // Create query string from filters
      const queryParams = new URLSearchParams();

      if (filters.type) queryParams.append("type", filters.type);
      if (filters.muscle) queryParams.append("muscle", filters.muscle);
      if (filters.difficulty)
        queryParams.append("difficulty", filters.difficulty);

      const queryString = queryParams.toString();
      const endpoint = `/exercises${queryString ? `?${queryString}` : ""}`;

      console.log("Request URL:", `${API_BASE_URL}${endpoint}`);

      const response = await apiClient.get(endpoint);

      // Handle different response formats
      if (response.data.exercises) {
        return response.data.exercises;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  getExerciseById: async (id: string) => {
    try {
      const response = await apiClient.get(`/exercises/${id}`);

      // Handle different response formats
      if (response.data.exercise) {
        return response.data.exercise;
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise with ID ${id}:`, error);
      throw error;
    }
  },

  getBodyParts: async () => {
    try {
      const response = await apiClient.get("/exercises/categories/bodyparts");

      // Handle different response formats
      if (response.data.bodyParts) {
        return response.data.bodyParts;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching body parts:", error);
      // Return empty array on error
      return [];
    }
  },

  getExerciseTypes: async () => {
    try {
      const response = await apiClient.get("/exercises/categories/types");

      // Handle different response formats
      if (response.data.types) {
        return response.data.types;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise types:", error);
      // Return empty array on error
      return [];
    }
  },
};

export default apiService;
