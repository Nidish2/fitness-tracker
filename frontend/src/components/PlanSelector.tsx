import { useState, useEffect } from "react";
import apiService from "../services/api";

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
  exercises: number | Exercise[]; // Can be either the count or array of exercises
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

interface UserData {
  id: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  gender?: string;
  fitnessLevel?: string;
  selectedPlanId?: string;
  isProfileComplete?: boolean;
}

interface PlanSelectorProps {
  userData: UserData;
  onPlanSelect: (planId: string) => void;
}

const PlanSelector = ({ userData, onPlanSelect }: PlanSelectorProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIntensity, setSelectedIntensity] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    userData.selectedPlanId || ""
  );
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Fetch all plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(""); // Clear any previous errors

        console.log("Fetching workout plans...");
        const fetchedPlans = await apiService.getWorkoutPlans();
        console.log("Fetched plans:", fetchedPlans);

        if (Array.isArray(fetchedPlans) && fetchedPlans.length > 0) {
          setPlans(fetchedPlans);
          setFilteredPlans(fetchedPlans);
          setDebugInfo(`Successfully fetched ${fetchedPlans.length} plans`);
        } else {
          setDebugInfo("Received empty or invalid plans data");
          setError("No workout plans available");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching plans:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch workout plans";
        setError(errorMessage);
        setDebugInfo(`Error: ${errorMessage}`);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter plans based on user data, selected filters, and search term
  useEffect(() => {
    if (!plans.length) return;

    let filtered = [...plans];

    // Log filtering process for debugging
    console.log("Filtering plans. Starting with:", plans.length);

    // Filter by user age if available
    if (userData.age !== undefined) {
      const userAge = userData.age;
      filtered = filtered.filter(
        (plan) =>
          !plan.targetAgeMin ||
          !plan.targetAgeMax ||
          (userAge >= plan.targetAgeMin && userAge <= plan.targetAgeMax)
      );
      console.log("After age filter:", filtered.length);
    }

    // Filter by user gender if available
    if (userData.gender && userData.gender !== "prefer-not-to-say") {
      filtered = filtered.filter(
        (plan) =>
          !plan.targetGender ||
          plan.targetGender === "all" ||
          plan.targetGender === userData.gender
      );
      console.log("After gender filter:", filtered.length);
    }

    // Filter by selected intensity
    if (selectedIntensity) {
      filtered = filtered.filter(
        (plan) => plan.intensity === selectedIntensity
      );
      console.log("After intensity filter:", filtered.length);
    }

    // Filter by selected duration
    if (selectedDuration) {
      filtered = filtered.filter((plan) => plan.duration === selectedDuration);
      console.log("After duration filter:", filtered.length);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (plan) =>
          plan.name.toLowerCase().includes(term) ||
          (plan.description && plan.description.toLowerCase().includes(term))
      );
      console.log("After search term filter:", filtered.length);
    }

    setFilteredPlans(filtered);
  }, [plans, userData, selectedIntensity, selectedDuration, searchTerm]);

  // Handle plan selection
  const handlePlanSelect = async (planId: string) => {
    try {
      setSelectedPlanId(planId);
      console.log(`Selected plan ID: ${planId}`);

      // Call the API to save the selected plan
      await apiService.selectWorkoutPlan(userData.clerkId, planId);
      console.log("Plan selection saved successfully");

      // Notify parent component with the updated data
      onPlanSelect(planId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to select plan";
      console.error("Error selecting plan:", errorMessage);
      setError(errorMessage);
    }
  };

  // Determine the appropriate intensity based on fitness level
  useEffect(() => {
    if (userData.fitnessLevel && !selectedIntensity) {
      switch (userData.fitnessLevel) {
        case "beginner":
          setSelectedIntensity("low");
          break;
        case "intermediate":
          setSelectedIntensity("moderate");
          break;
        case "advanced":
          setSelectedIntensity("tough");
          break;
        default:
          setSelectedIntensity("");
      }
    }
  }, [userData.fitnessLevel, selectedIntensity]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Select a Workout Plan
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search Plans
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="intensity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Intensity
          </label>
          <select
            id="intensity"
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Intensities</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="tough">Tough</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Duration
          </label>
          <select
            id="duration"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Durations</option>
            <option value="10 days">10 Days</option>
            <option value="30 days">30 Days</option>
            <option value="6 months">6 Months</option>
            <option value="1 year">1 Year</option>
          </select>
        </div>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-50 text-xs text-gray-500 rounded">
        Available Plans: {plans.length} | Filtered Plans: {filteredPlans.length}
        {debugInfo && <div className="mt-1">{debugInfo}</div>}
      </div>

      {/* Plan cards */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No workout plans found that match your criteria. Try adjusting your
          filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlanId === plan.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <h4 className="font-medium text-gray-800 mb-2">{plan.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Intensity: {plan.intensity}</span>
                <span>Duration: {plan.duration}</span>
              </div>
              <div className="text-xs text-gray-500">
                <span>{plan.daysPerWeek} days/week</span>
                <span className="ml-2">•</span>
                <span className="ml-2">
                  {typeof plan.exercises === "number"
                    ? plan.exercises
                    : plan.exercises.length}{" "}
                  exercises
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanSelector;
