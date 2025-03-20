import userService from "../../services/userService";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert as MuiAlert,
  Skeleton as MuiSkeleton,
  FormHelperText,
} from "@mui/material";
import { Edit } from "lucide-react";
import React, { useState, useEffect } from "react";

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
  const [activeTab, setActiveTab] = useState("details");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const data = await userService.getUserDetails(token);

      if (data) {
        setDetails({
          name: data.name || user?.fullName || "",
          age: data.age?.toString() || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
        });
      } else {
        setDetails({
          name: user?.fullName || "",
          age: "",
          height: "",
          weight: "",
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setError(
        "Could not load your details. Please refresh the page or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!details.name.trim()) errors.name = "Name is required";
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
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (bmi === "N/A") return { category: "Not available", color: "#6b7280" };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: "Underweight", color: "#3b82f6" };
    if (bmiValue < 25) return { category: "Normal weight", color: "#10b981" };
    if (bmiValue < 30) return { category: "Overweight", color: "#f59e0b" };
    return { category: "Obesity", color: "#ef4444" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token is missing");

      const dataToSend = {
        name: details.name.trim(),
        age: Number(details.age),
        height: Number(details.height),
        weight: Number(details.weight),
        userId: user?.id,
      };

      const response = await userService.saveUserDetails(dataToSend, token);
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to save details");
      }

      setSuccess("Details saved successfully!");
      setIsEditing(false);
      setRetryCount(0);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to save user details:", error);
      setError("Failed to save details. Please try again.");
      if (retryCount < 2 && error.message?.includes("network")) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => handleSubmit(e), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={details.name}
            onChange={handleChange}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={details.age}
            onChange={handleChange}
            error={!!validationErrors.age}
            helperText={validationErrors.age}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Height (cm)"
            name="height"
            type="number"
            value={details.height}
            onChange={handleChange}
            error={!!validationErrors.height}
            helperText={validationErrors.height}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            value={details.weight}
            onChange={handleChange}
            error={!!validationErrors.weight}
            helperText={validationErrors.weight}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Details"}
          </Button>
          {details.name && (
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );

  const renderDetails = () => {
    const bmi = calculateBMI();
    const { category, color } = getBMICategory(bmi);

    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={1} style={{ padding: "16px" }}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="h6">{details.name}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={1} style={{ padding: "16px" }}>
              <Typography variant="subtitle2" color="textSecondary">
                Age
              </Typography>
              <Typography variant="h6">{details.age} years</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={1} style={{ padding: "16px" }}>
              <Typography variant="subtitle2" color="textSecondary">
                Height
              </Typography>
              <Typography variant="h6">{details.height} cm</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={1} style={{ padding: "16px" }}>
              <Typography variant="subtitle2" color="textSecondary">
                Weight
              </Typography>
              <Typography variant="h6">{details.weight} kg</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Paper elevation={1} style={{ padding: "16px", marginTop: "16px" }}>
          <Typography variant="subtitle2" color="textSecondary">
            BMI (Body Mass Index)
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="h6">{bmi}</Typography>
            <Typography variant="body1" style={{ marginLeft: "8px", color }}>
              - {category}
            </Typography>
          </Box>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          startIcon={<Edit size={16} />}
          style={{ marginTop: "16px" }}
        >
          Edit Details
        </Button>
      </Box>
    );
  };

  const renderLoadingSkeleton = () => (
    <Box>
      <MuiSkeleton
        variant="rectangular"
        height={48}
        style={{ marginBottom: "16px" }}
      />
      <MuiSkeleton
        variant="rectangular"
        height={48}
        style={{ marginBottom: "16px" }}
      />
      <MuiSkeleton
        variant="rectangular"
        height={48}
        style={{ marginBottom: "16px" }}
      />
      <MuiSkeleton
        variant="rectangular"
        height={48}
        style={{ marginBottom: "16px" }}
      />
      <MuiSkeleton variant="rectangular" height={40} width={128} />
    </Box>
  );

  return (
    <Paper
      elevation={3}
      style={{ padding: "24px", maxWidth: "36rem", margin: "0 auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Personal Details
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Your fitness profile information
      </Typography>

      {error && (
        <MuiAlert severity="error" style={{ marginBottom: "16px" }}>
          {error}
        </MuiAlert>
      )}
      {success && (
        <MuiAlert severity="success" style={{ marginBottom: "16px" }}>
          {success}
        </MuiAlert>
      )}

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        style={{ marginBottom: "16px" }}
      >
        <Tab label="Your Details" value="details" />
        <Tab label="Health Tips" value="tips" />
      </Tabs>

      {activeTab === "details" && (
        <Box>
          {loading
            ? renderLoadingSkeleton()
            : isEditing
            ? renderForm()
            : renderDetails()}
        </Box>
      )}

      {activeTab === "tips" && (
        <MuiAlert severity="info">
          <Typography variant="h6">Health Tips</Typography>
          <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
            <li style={{ marginBottom: "8px" }}>
              Maintain a balanced diet rich in fruits, vegetables, and proteins
            </li>
            <li style={{ marginBottom: "8px" }}>
              Aim for at least 150 minutes of moderate activity per week
            </li>
            <li style={{ marginBottom: "8px" }}>
              Stay hydrated by drinking at least 8 glasses of water daily
            </li>
            <li style={{ marginBottom: "8px" }}>
              Get 7-9 hours of quality sleep each night
            </li>
            <li>Take breaks and stretch if you sit for long periods</li>
          </ul>
        </MuiAlert>
      )}
    </Paper>
  );
};

export default PersonalDetails;
