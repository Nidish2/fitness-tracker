import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import PersonalDetailsForm from "../components/Dashboard/PersonalDetails";
import { getUserDetails, updateUserDetails } from "../services/userService";
import { getClerkToken } from "../services/authService";

interface UserDetails {
  name?: string;
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  weightHistory?: { weight: number; date: string }[];
  clerkId?: string;
}

interface ApiStatusType {
  message: string;
  isError: boolean;
  details?: string;
}

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiStatus, setApiStatus] = useState<ApiStatusType>({
    message: "",
    isError: false,
  });
  const [isRetrying, setIsRetrying] = useState(false);

  // Enhanced error handling function
  const handleApiError = (err: unknown, context: string) => {
    console.error(`Error ${context}:`, err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    setError(`Failed to ${context}. Please try again.`);
    setApiStatus({
      message: `API Error: ${errorMessage}`,
      isError: true,
      details: context,
    });
  };

  // Verify connection function
  const verifyConnection = async () => {
    setLoading(true);
    setApiStatus({
      message: "Verifying connection...",
      isError: false,
    });

    try {
      // First try the protected route
      const response = await fetch("http://localhost:5000/api/auth/protected", {
        headers: {
          Authorization: `Bearer ${await getClerkToken()}`,
        },
      });

      if (!response.ok) {
        // Try to get detailed error message
        let errorMsg;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || response.statusText;
        } catch {
          errorMsg = response.statusText;
        }

        throw new Error(errorMsg || "API connection failed");
      }

      const data = await response.json();
      console.log("Protected route response:", data);

      setApiStatus({
        message: "Connection verified successfully!",
        isError: false,
      });
    } catch (err) {
      console.log("this is an error");
      setApiStatus({
        message: `Connection error: ${
          err instanceof Error ? err.message : String(err)
        }`,
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (showLoading = true) => {
    if (!user) return;
    if (showLoading) setLoading(true);

    setApiStatus({
      message: "Fetching user details...",
      isError: false,
    });

    try {
      // Log Clerk user ID for debugging
      console.log("Clerk user ID:", user.id);

      const data = await getUserDetails();
      console.log("API Response:", data);

      setUserDetails(data);

      if (!data.name) {
        setIsEditing(true);
      }

      setError("");
      setApiStatus({
        message: "User details fetched successfully!",
        isError: false,
      });
    } catch (err) {
      handleApiError(err, "load user details");
      setUserDetails({}); // Initialize with empty object to avoid null errors
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserDetails();
    }
  }, [user, isLoaded]);

  // For debugging: Check token in console
  useEffect(() => {
    if (isLoaded && user) {
      const checkToken = async () => {
        try {
          const token = await getClerkToken();
          console.log("Clerk token obtained:", token ? "Yes" : "No");
          console.log("Clerk user:", user);
        } catch (err) {
          console.error("Error getting token:", err);
        }
      };

      checkToken();
    }
  }, [isLoaded, user]);

  const handleRetry = () => {
    setIsRetrying(true);
    setError("");
    fetchUserDetails().finally(() => {
      setIsRetrying(false);
    });
  };

  const handleSubmitDetails = async (details: {
    name: string;
    age: number;
    height: number;
    weight: number;
  }) => {
    setLoading(true);
    setError("");
    setApiStatus({
      message: "Updating user details...",
      isError: false,
    });

    try {
      console.log("Sending to API:", details);

      const response = await updateUserDetails(details);
      setUserDetails(response.user);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      setApiStatus({
        message: "Update API call successful!",
        isError: false,
      });

      console.log("API Response:", response);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      handleApiError(err, "update user details");
    } finally {
      setLoading(false);
    }
  };

  // Debug info component
  const DebugInfo = () => (
    <div className="mt-8 border-t border-gray-200 pt-4">
      <h3 className="font-semibold text-gray-700">Debug Information</h3>
      <div className="bg-gray-50 p-4 rounded mt-2 text-sm font-mono overflow-x-auto">
        <p>Clerk User ID: {user?.id || "Not loaded"}</p>
        <p>MongoDB clerkId: {userDetails?.clerkId || "Not available"}</p>
        <p>API Status: {apiStatus.message}</p>
        {apiStatus.details && <p>Context: {apiStatus.details}</p>}
      </div>
      <div className="mt-4">
        <button
          onClick={verifyConnection}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Verify API Connection
        </button>
      </div>
    </div>
  );

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="pb-5 border-b border-gray-200 mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back,{" "}
              {user?.firstName || userDetails?.name || "Fitness Enthusiast"}!
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <p>{error}</p>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-1 px-3 rounded ml-2"
                >
                  {isRetrying ? "Retrying..." : "Retry"}
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {/* API Status for debugging */}
          {apiStatus.message && (
            <div
              className={`${
                apiStatus.isError
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "bg-blue-100 border-blue-400 text-blue-700"
              } px-4 py-3 rounded mb-4 border`}
            >
              <strong>API Status:</strong> {apiStatus.message}
            </div>
          )}

          {isEditing ? (
            <PersonalDetailsForm
              onSubmit={handleSubmitDetails}
              initialValues={userDetails ?? {}}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-indigo-700">
                    Your Profile
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {userDetails?.name || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">
                      {userDetails?.age
                        ? `${userDetails.age} years`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">
                      {userDetails?.height
                        ? `${userDetails.height} cm`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">
                      {userDetails?.weight
                        ? `${userDetails.weight} kg`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">BMI:</span>
                    <span className="font-medium">
                      {userDetails?.bmi ? userDetails.bmi.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                  Your Progress
                </h2>
                {userDetails?.weightHistory &&
                userDetails.weightHistory.length > 0 ? (
                  <div>
                    <p className="text-gray-600 mb-2">Weight History:</p>
                    <div className="space-y-2">
                      {userDetails.weightHistory
                        .slice(-5)
                        .map((record, index) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                            <span className="font-medium">
                              {record.weight} kg
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No weight history recorded yet.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                Record Weight
              </button>
              <button className="p-4 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                Log Workout
              </button>
              <button className="p-4 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                Update Goals
              </button>
            </div>
          </div>

          {/* Debug info - keep this during development */}
          <DebugInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
