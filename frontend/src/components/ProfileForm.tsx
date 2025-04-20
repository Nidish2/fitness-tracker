import { useState, useEffect, FormEvent } from "react";
import apiService from "../services/api";

interface UserData {
  id?: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  fitnessLevel?: string;
  selectedPlanId?: string;
  isProfileComplete?: boolean;
}

interface ProfileFormProps {
  userData: UserData;
  onProfileUpdate: (updatedData: UserData) => void;
}

const ProfileForm = ({ userData, onProfileUpdate }: ProfileFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    ...userData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Update form data when userData changes
  useEffect(() => {
    setFormData({ ...userData });
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Convert numeric fields to numbers
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Required fields validation
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("Name and email are required fields");
        setLoading(false);
        return;
      }

      // Age validation
      if (
        formData.age !== undefined &&
        (formData.age < 13 || formData.age > 100)
      ) {
        setError("Age must be between 13 and 100");
        setLoading(false);
        return;
      }

      // Height validation
      if (
        formData.height !== undefined &&
        (formData.height < 100 || formData.height > 250)
      ) {
        setError("Height must be between 100 and 250 cm");
        setLoading(false);
        return;
      }

      // Weight validation
      if (
        formData.weight !== undefined &&
        (formData.weight < 30 || formData.weight > 300)
      ) {
        setError("Weight must be between 30 and 300 kg");
        setLoading(false);
        return;
      }

      // Create a properly typed object for the profile update
      const profileUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        gender: formData.gender,
        fitnessLevel: formData.fitnessLevel,
      };

      console.log("Submitting profile update with data:", profileUpdateData);

      const updatedUser = await apiService.updateUserProfile(
        formData.clerkId,
        profileUpdateData
      );

      console.log("Received updated user data:", updatedUser);

      setSuccess(true);
      // Make sure we're passing the complete updated user data
      onProfileUpdate({
        ...userData, // Keep existing data
        ...updatedUser, // Update with new data
        isProfileComplete: true, // Mark as complete
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Personal Details
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 p-4 rounded-md">
          <p className="text-green-600">Profile updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              min={13}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Height */}
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height || ""}
              onChange={handleChange}
              min={100}
              max={250}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight || ""}
              onChange={handleChange}
              min={30}
              max={300}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Fitness Level */}
          <div>
            <label
              htmlFor="fitnessLevel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fitness Level
            </label>
            <select
              id="fitnessLevel"
              name="fitnessLevel"
              value={formData.fitnessLevel || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Fitness Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...userData,
                });
                setError("");
                setSuccess(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              }`}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
