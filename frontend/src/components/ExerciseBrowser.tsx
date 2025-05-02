import { useState, useEffect, useCallback } from "react";
import apiService from "../services/api";

interface Exercise {
  name: string;
  description: string;
  durationMinutes: number;
  sets: number;
  reps: number;
  restSeconds: number;
  imageUrl: string;
  videoUrl: string | null;
  exerciseDbId: string;
  muscle?: string;
  equipment?: string;
  difficulty?: string;
}

interface ExerciseFilters {
  type?: string;
  muscle?: string;
  difficulty?: string;
}

const ExerciseBrowser = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [filters, setFilters] = useState<ExerciseFilters>({
    type: "",
    muscle: "",
    difficulty: "",
  });

  // Fetch exercises based on filters
  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Debug the request
      console.log("Fetching exercises with filters:", filters);

      const response = await apiService.getExercises(filters);

      // Debug the response
      console.log("API response:", response);

      // Handle both possible response formats
      const exercisesData = response.exercises || response;

      if (Array.isArray(exercisesData)) {
        setExercises(exercisesData);
      } else {
        console.error("Unexpected response format:", exercisesData);
        setError("Received invalid data format from the server.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch exercises:", err);
      setError("Failed to load exercises. Please try again later.");
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories for filter dropdowns
  const fetchCategories = async () => {
    try {
      // Fetch body parts
      const bodyPartsResponse = await apiService.getBodyParts();

      // Debug
      console.log("Body parts response:", bodyPartsResponse);

      // Handle different response formats
      const bodyPartsData = bodyPartsResponse.bodyParts || bodyPartsResponse;

      if (Array.isArray(bodyPartsData)) {
        setBodyParts(bodyPartsData);
      } else {
        console.error("Unexpected body parts format:", bodyPartsData);
      }

      // Fetch exercise types
      const typesResponse = await apiService.getExerciseTypes();

      // Debug
      console.log("Exercise types response:", typesResponse);

      // Handle different response formats
      const typesData = typesResponse.types || typesResponse;

      if (Array.isArray(typesData)) {
        setExerciseTypes(typesData);
      } else {
        console.error("Unexpected exercise types format:", typesData);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(
        "Failed to load filter options. Some filters may not be available."
      );
    }
  };

  // Fetch exercise details
  const fetchExerciseDetails = async (id: string) => {
    try {
      setLoading(true);

      console.log("Fetching exercise details for ID:", id);

      const response = await apiService.getExerciseById(id);

      console.log("Exercise details response:", response);

      // Handle different response formats
      const exerciseData = response.exercise || response;

      setSelectedExercise(exerciseData as Exercise);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch exercise details:", err);
      setError("Failed to load exercise details. Please try again.");
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (
    filterName: keyof ExerciseFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Apply filters and fetch exercises
  const applyFilters = () => {
    fetchExercises();
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      type: "",
      muscle: "",
      difficulty: "",
    });
    setTimeout(() => fetchExercises(), 0);
  };

  // Initial data fetching
  useEffect(() => {
    console.log("ExerciseBrowser component mounted");
    fetchExercises();
    fetchCategories();
  }, [fetchExercises]); // Include fetchExercises as a dependency

  // Back to exercise list
  const handleBackToList = () => {
    setSelectedExercise(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-blue-800 mb-6">Exercise Browser</h2>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!selectedExercise ? (
        <>
          {/* Filters Section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Muscle Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Muscle Group
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.muscle || ""}
                  onChange={(e) => handleFilterChange("muscle", e.target.value)}
                >
                  <option value="">All Muscle Groups</option>
                  {bodyParts.map((part) => (
                    <option key={part} value={part}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exercise Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Type
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.type || ""}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">All Types</option>
                  {exerciseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={filters.difficulty || ""}
                  onChange={(e) =>
                    handleFilterChange("difficulty", e.target.value)
                  }
                >
                  <option value="">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Exercise List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Exercises ({exercises.length})
              </h3>

              {exercises.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No exercises found matching your filters. Try adjusting your
                  filters or search criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.exerciseDbId}
                      className="border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() =>
                        fetchExerciseDetails(exercise.exerciseDbId)
                      }
                    >
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={exercise.imageUrl || "/placeholder-exercise.png"}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-exercise.png";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 mb-1">
                          {exercise.name}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {exercise.muscle && (
                            <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs mr-2">
                              {exercise.muscle}
                            </span>
                          )}
                          {exercise.equipment && (
                            <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs mr-2">
                              {exercise.equipment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // Exercise Detail View
        <div>
          <button
            onClick={handleBackToList}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Exercise List
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-200 rounded-lg overflow-hidden h-64">
                <img
                  src={selectedExercise.imageUrl || "/placeholder-exercise.png"}
                  alt={selectedExercise.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-exercise.png";
                  }}
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedExercise.name}
              </h2>

              <div className="mb-4 flex flex-wrap gap-2">
                {selectedExercise.muscle && (
                  <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                    Muscle: {selectedExercise.muscle}
                  </span>
                )}
                {selectedExercise.equipment && (
                  <span className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                    Equipment: {selectedExercise.equipment}
                  </span>
                )}
                {selectedExercise.difficulty && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-sm">
                    Difficulty: {selectedExercise.difficulty}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">Sets:</span>
                  <p className="font-medium">{selectedExercise.sets}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">Reps:</span>
                  <p className="font-medium">{selectedExercise.reps}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <p className="font-medium">
                    {selectedExercise.durationMinutes} min
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm text-gray-500">Rest:</span>
                  <p className="font-medium">
                    {selectedExercise.restSeconds} sec
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2">
                  Add to My Workout
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Save for Later
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Instructions
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">
                {selectedExercise.description ||
                  "No instructions available for this exercise."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseBrowser;
