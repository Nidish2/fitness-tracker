import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

interface UserData {
  id?: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isProfileComplete?: boolean;
  createdAt?: string;
}

const Dashboard = () => {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ensureUserRegistered = async () => {
      if (!isLoaded || !user?.id) return;

      let attempts = 0;
      const maxAttempts = 5;
      const interval = 1000; // 1 second

      const tryRegister = async () => {
        if (attempts >= maxAttempts) {
          setError("Failed to register user after multiple attempts");
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const token = await window.Clerk?.session?.getToken();
          if (!token) {
            throw new Error("Authentication token not available yet");
          }

          // Try to get existing user
          try {
            const existingUser = await apiService.getUser(user.id);
            if (existingUser) {
              setUserData({ ...existingUser, clerkId: user.id });
              setLoading(false);
              return;
            }
          } catch (err) {
            if (!(err instanceof Error && err.message.includes("not found"))) {
              throw err;
            }
          }

          // Register new user
          const registeredUser = await apiService.registerUser(user.id);
          setUserData({ ...registeredUser, clerkId: user.id });
          setLoading(false);
        } catch (error) {
          console.error("Registration attempt failed:", error);
          attempts++;
          setTimeout(tryRegister, interval);
        }
      };

      tryRegister();
    };

    ensureUserRegistered();
  }, [isLoaded, user?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-800">
                Fitness Tracker
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 rounded text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome to your Dashboard!
              </h2>

              {error && (
                <div className="mt-4 bg-red-50 p-4 rounded-md">
                  <p className="text-red-600 mb-2">{error}</p>
                </div>
              )}

              {userData && (
                <div className="mt-8">
                  <p className="font-medium text-lg mb-2">User Information:</p>
                  <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-700">
                      Welcome, {userData.firstName || "Valued Member"}
                    </p>
                    {userData.createdAt && (
                      <p className="text-gray-600 mt-2">
                        Account created:{" "}
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
