import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import ProfileForm from "./ProfileForm";
import PlanSelector from "./PlanSelector";
import ExerciseBrowser from "./ExerciseBrowser"; // Import the ExerciseBrowser component

interface UserData {
  id?: string;
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
}

interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  targetMuscleGroup?: string[];
}

interface Plan {
  id: string;
  name: string;
  description: string;
  intensity: "low" | "moderate" | "tough";
  duration: "10 days" | "30 days" | "6 months" | "1 year";
  daysPerWeek: number;
  exercises: Exercise[];
}

const Dashboard = () => {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // Now has: "profile", "plans", or "exercises"

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

              // If user has a selected plan, fetch its details
              if (existingUser.selectedPlanId) {
                fetchSelectedPlan(existingUser.selectedPlanId);
              }

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

  // Fetch selected plan details
  const fetchSelectedPlan = async (planId: string) => {
    try {
      setPlanLoading(true);
      const plan = (await apiService.getWorkoutPlanById(
        planId
      )) as unknown as Plan;
      setSelectedPlan(plan);
      setPlanLoading(false);
    } catch (err) {
      console.error("Failed to fetch plan details:", err);
      setPlanLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  const handleProfileUpdate = (updatedData: UserData) => {
    setUserData(updatedData);

    // If profile is complete and no plan is selected, switch to plans tab
    if (updatedData.isProfileComplete && !updatedData.selectedPlanId) {
      setActiveTab("plans");
    }
  };

  const handlePlanSelect = async (planId: string) => {
    if (userData) {
      // Update state
      setUserData({
        ...userData,
        selectedPlanId: planId,
      });

      // Fetch the plan details
      await fetchSelectedPlan(planId);
    }
  };

  // Check if should redirect to profile based on completion status
  useEffect(() => {
    if (userData && !userData.isProfileComplete && activeTab !== "profile") {
      setActiveTab("profile");
    }
  }, [userData, activeTab]);

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
              {userData?.firstName && (
                <span className="mr-4 text-gray-600">
                  Welcome, {userData.firstName}!
                </span>
              )}
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
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "plans"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } ${
                  !userData?.isProfileComplete
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() =>
                  userData?.isProfileComplete && setActiveTab("plans")
                }
                disabled={!userData?.isProfileComplete}
              >
                Workout Plans
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "exercises"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } ${
                  !userData?.isProfileComplete
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() =>
                  userData?.isProfileComplete && setActiveTab("exercises")
                }
                disabled={!userData?.isProfileComplete}
              >
                Exercises
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 p-4 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {userData && activeTab === "profile" && (
            <ProfileForm
              userData={userData}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {userData && activeTab === "plans" && (
            <div>
              <PlanSelector
                userData={{ ...userData, id: userData.id || "" }}
                onPlanSelect={handlePlanSelect}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => console.log("Search functionality triggered")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Search Plans
                </button>
              </div>
            </div>
          )}

          {userData && activeTab === "exercises" && <ExerciseBrowser />}

          {/* Selected Plan Display Section - Only show if user has selected a plan */}
          {userData?.selectedPlanId &&
            selectedPlan &&
            activeTab === "plans" && (
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Your Selected Workout Plan
                </h3>

                {planLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <p className="text-green-600">
                        You have selected the{" "}
                        <strong>{selectedPlan.name}</strong> plan!
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Plan Details:
                      </h4>
                      <p className="text-gray-600 mb-2">
                        {selectedPlan.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-sm text-gray-500">
                            Intensity:
                          </span>
                          <p className="font-medium">
                            {selectedPlan.intensity}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-sm text-gray-500">
                            Duration:
                          </span>
                          <p className="font-medium">{selectedPlan.duration}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-sm text-gray-500">
                            Days per week:
                          </span>
                          <p className="font-medium">
                            {selectedPlan.daysPerWeek}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-sm text-gray-500">
                            Exercises:
                          </span>
                          <p className="font-medium">
                            {selectedPlan.exercises.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        onClick={() =>
                          console.log(
                            "View plan details functionality - to be implemented in Phase 4"
                          )
                        }
                      >
                        View Plan Details
                      </button>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                        onClick={() => console.log("Edit data functionality")}
                      >
                        Edit Data
                      </button>
                      <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onClick={() => setActiveTab("exercises")}
                      >
                        Browse Exercises
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
