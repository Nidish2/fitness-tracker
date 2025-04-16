// Modified userService.tsx
import { getClerkToken } from "./authService";

const API_BASE_URL = "http://localhost:5000/api";

// Enhanced error handling
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || `HTTP error! status: ${response.status}`;
      console.error("API error details:", errorData);
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const getUserDetails = async () => {
  try {
    console.log("Fetching user details...");
    const token = await getClerkToken();

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(
      "Auth token obtained (first 10 chars):",
      token.substring(0, 10) + "..."
    );

    const response = await fetch(`${API_BASE_URL}/user/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    console.log("API response status:", response.status);
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const updateUserDetails = async (details: {
  name: string;
  age: number;
  height: number;
  weight: number;
}) => {
  try {
    console.log("Updating user details with:", details);
    const token = await getClerkToken();

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/user/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(details),
    });

    console.log("API response status:", response.status);
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// Add a verification function
export const verifyApiConnection = async () => {
  try {
    console.log("Verifying API connection...");
    const token = await getClerkToken();

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/auth/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Verification response status:", response.status);
    return await handleApiResponse(response);
  } catch (error) {
    console.error("API verification error:", error);
    throw error;
  }
};
