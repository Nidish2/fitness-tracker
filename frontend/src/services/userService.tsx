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

  const data = await response.json();
  if (!data) {
    throw new Error("Empty response from API");
  }
  return data;
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
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      credentials: "include", // Include credentials in the request
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

    // Ensure numeric values are properly formatted
    const formattedDetails = {
      name: details.name,
      age: Number(details.age),
      height: Number(details.height),
      weight: Number(details.weight),
    };

    const response = await fetch(`${API_BASE_URL}/user/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(formattedDetails),
      credentials: "include", // Include credentials in the request
    });

    console.log("API response status:", response.status);
    const data = await handleApiResponse(response);

    // Log the response for debugging
    console.log("Update response data:", data);

    return data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// API connection verification function
export const verifyApiConnection = async () => {
  try {
    console.log("Verifying API connection...");
    const token = await getClerkToken();

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/auth/protected`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      credentials: "include", // Include credentials in the request
    });

    console.log("Verification response status:", response.status);
    return await handleApiResponse(response);
  } catch (error) {
    console.error("API verification error:", error);
    throw error;
  }
};
