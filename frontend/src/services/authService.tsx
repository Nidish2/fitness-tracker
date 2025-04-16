// src/services/authService.ts
// Helper service for authentication

// Add Clerk token getter for use in other services
// clerk.d.ts
declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: () => Promise<string>;
      };
      user?: {
        id: string;
      };
    };
  }
}
export const getClerkToken = async (): Promise<string> => {
  try {
    // Get the session token from Clerk
    const token = await window.Clerk?.session?.getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw new Error("Authentication failed - please log in again");
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return window.Clerk?.session !== undefined;
};

// Log user authentication status for debugging
export const logAuthStatus = (): void => {
  console.log("Auth status:", {
    hasClerk: Boolean(window.Clerk),
    hasSession: Boolean(window.Clerk?.session),
    userId: window.Clerk?.user?.id || "Not available",
  });
};
