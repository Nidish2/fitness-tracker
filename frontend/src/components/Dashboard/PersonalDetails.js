import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import userService from "../../services/userService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  AlertCircle,
  InfoIcon,
  Edit,
  Save,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PersonalDetails = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [details, setDetails] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await userService.getUserDetails(token);
      if (data) {
        setDetails({
          name: data.name || user?.fullName || "",
          age: data.age?.toString() || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
        });
      } else {
        // If there's no data yet, pre-fill with user data from Clerk
        setDetails({
          name: user?.fullName || "",
          age: "",
          height: "",
          weight: "",
        });
        // Show edit mode for new users
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setError("Could not load your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!details.name.trim()) {
      errors.name = "Name is required";
    }

    if (!details.age) {
      errors.age = "Age is required";
    } else if (
      isNaN(details.age) ||
      Number(details.age) <= 0 ||
      Number(details.age) > 120
    ) {
      errors.age = "Please enter a valid age (1-120)";
    }

    if (!details.height) {
      errors.height = "Height is required";
    } else if (
      isNaN(details.height) ||
      Number(details.height) <= 0 ||
      Number(details.height) > 300
    ) {
      errors.height = "Please enter a valid height (1-300 cm)";
    }

    if (!details.weight) {
      errors.weight = "Weight is required";
    } else if (
      isNaN(details.weight) ||
      Number(details.weight) <= 0 ||
      Number(details.weight) > 500
    ) {
      errors.weight = "Please enter a valid weight (1-500 kg)";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const calculateBMI = () => {
    if (!details.height || !details.weight) return "N/A";

    const heightInMeters = Number(details.height) / 100;
    const weightInKg = Number(details.weight);

    if (heightInMeters <= 0) return "N/A";

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi === "N/A")
      return { category: "Not available", color: "text-gray-500" };

    const bmiValue = parseFloat(bmi);

    if (bmiValue < 18.5) {
      return { category: "Underweight", color: "text-blue-500" };
    } else if (bmiValue < 25) {
      return { category: "Normal weight", color: "text-green-500" };
    } else if (bmiValue < 30) {
      return { category: "Overweight", color: "text-yellow-500" };
    } else {
      return { category: "Obesity", color: "text-red-500" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const dataToSend = {
        name: details.name,
        age: Number(details.age),
        height: Number(details.height),
        weight: Number(details.weight),
      };

      await userService.saveUserDetails(dataToSend, token);
      setSuccess("Details saved successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to save user details:", error);
      setError("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          name="name"
          value={details.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={validationErrors.name ? "border-red-500" : ""}
        />
        {validationErrors.name && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          name="age"
          value={details.age}
          onChange={handleChange}
          placeholder="Enter your age"
          className={validationErrors.age ? "border-red-500" : ""}
        />
        {validationErrors.age && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>
        )}
      </div>

      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          name="height"
          value={details.height}
          onChange={handleChange}
          placeholder="Enter your height in cm"
          className={validationErrors.height ? "border-red-500" : ""}
        />
        {validationErrors.height && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.height}</p>
        )}
      </div>

      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          name="weight"
          value={details.weight}
          onChange={handleChange}
          placeholder="Enter your weight in kg"
          className={validationErrors.weight ? "border-red-500" : ""}
        />
        {validationErrors.weight && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.weight}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Details"}
        </Button>
        {details.name && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  const renderDetails = () => {
    const bmi = calculateBMI();
    const { category, color } = getBMICategory(bmi);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <div className="rounded-lg bg-gray-50 p-3">
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg font-semibold">{details.name}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="rounded-lg bg-gray-50 p-3">
              <h3 className="text-sm font-medium text-gray-500">Age</h3>
              <p className="mt-1 text-lg font-semibold">{details.age} years</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="rounded-lg bg-gray-50 p-3">
              <h3 className="text-sm font-medium text-gray-500">Height</h3>
              <p className="mt-1 text-lg font-semibold">{details.height} cm</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="rounded-lg bg-gray-50 p-3">
              <h3 className="text-sm font-medium text-gray-500">Weight</h3>
              <p className="mt-1 text-lg font-semibold">{details.weight} kg</p>
            </div>
          </div>

          <div className="col-span-2">
            <div className="rounded-lg bg-gray-50 p-3">
              <h3 className="text-sm font-medium text-gray-500">
                BMI (Body Mass Index)
              </h3>
              <div className="flex items-center mt-1">
                <p className="text-lg font-semibold">{bmi}</p>
                <p className={`ml-2 ${color}`}>- {category}</p>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto mt-4"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Personal Details</CardTitle>
        <CardDescription>Your fitness profile information</CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Success</AlertTitle>
                <AlertDescription className="text-green-600">
                  {success}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Your Details</TabsTrigger>
            <TabsTrigger value="tips">Health Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            {loading
              ? renderLoadingSkeleton()
              : isEditing
              ? renderForm()
              : renderDetails()}
          </TabsContent>

          <TabsContent value="tips">
            <div className="space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Health Tips</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>
                      Maintain a balanced diet rich in fruits, vegetables, and
                      proteins
                    </li>
                    <li>
                      Aim for at least 150 minutes of moderate activity per week
                    </li>
                    <li>
                      Stay hydrated by drinking at least 8 glasses of water
                      daily
                    </li>
                    <li>Get 7-9 hours of quality sleep each night</li>
                    <li>Take breaks and stretch if you sit for long periods</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
