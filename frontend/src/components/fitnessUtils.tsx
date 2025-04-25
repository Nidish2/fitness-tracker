/**
 * Utility functions for fitness data calculations
 */

/**
 * Calculate BMI (Body Mass Index)
 * @param weight Weight in kilograms
 * @param height Height in meters
 * @returns BMI value
 */
export const calculateBMI = (weight: number, height: number): number => {
  if (weight <= 0 || height <= 0) return 0;
  return weight / (height * height);
};

/**
 * Get BMI category based on BMI value
 * @param bmi BMI value
 * @returns BMI category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

/**
 * Calculate daily calorie needs (Basal Metabolic Rate)
 * @param weight Weight in kilograms
 * @param height Height in meters
 * @param age Age in years
 * @param gender 'male' or 'female'
 * @param activityLevel Activity level factor
 * @returns Daily calorie needs
 */
export const calculateDailyCalorieNeeds = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: number = 1.2
): number => {
  // Using Mifflin-St Jeor Equation
  let bmr = 0;

  if (gender.toLowerCase() === "male") {
    bmr = 10 * weight + 6.25 * height * 100 - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height * 100 - 5 * age - 161;
  }

  // Activity factors:
  // 1.2 = Sedentary (little or no exercise)
  // 1.375 = Lightly active (light exercise/sports 1-3 days/week)
  // 1.55 = Moderately active (moderate exercise/sports 3-5 days/week)
  // 1.725 = Very active (hard exercise/sports 6-7 days/week)
  // 1.9 = Extra active (very hard exercise, physical job or training twice a day)

  return Math.round(bmr * activityLevel);
};

/**
 * Format date to YYYY-MM-DD
 * @param date Date object
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Get date from X days ago
 * @param days Number of days ago
 * @returns Date object
 */
export const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Calculate calories burned from steps
 * @param steps Number of steps
 * @param weight Weight in kilograms
 * @returns Estimated calories burned
 */
export const calculateCaloriesFromSteps = (
  steps: number,
  weight: number = 70
): number => {
  // Average calories burned per mile (height and weight dependent)
  // Average person burns about 100 calories per mile (2000-2500 steps)
  const caloriesPerStep = 0.04 * (weight / 70);
  return Math.round(steps * caloriesPerStep);
};

/**
 * Calculate distance from steps
 * @param steps Number of steps
 * @param strideLength Stride length in meters
 * @returns Distance in kilometers
 */
export const calculateDistanceFromSteps = (
  steps: number,
  strideLength: number = 0.762
): number => {
  // Average stride length is about 0.762 meters (2.5 feet)
  const distanceInMeters = steps * strideLength;
  return distanceInMeters / 1000; // Convert to kilometers
};

/**
 * Calculate weekly average for numeric data
 * @param data Array of data with date and value properties
 * @param valueKey Key for the value to average
 * @returns Weekly average
 */
export const calculateWeeklyAverage = (
  data: Array<{
    date: string;
    [key: string]: number | string | boolean | null;
  }>,
  valueKey: string
): number => {
  if (data.length === 0) return 0;

  const sum = data.reduce((acc, item) => acc + Number(item[valueKey] || 0), 0);
  return Math.round(sum / data.length);
};

/**
 * Convert workout intensity level to user-friendly string
 * @param intensity Intensity level ('low', 'moderate', 'tough')
 * @returns User-friendly intensity string
 */
export const formatIntensity = (intensity: string): string => {
  switch (intensity.toLowerCase()) {
    case "low":
      return "Beginner";
    case "moderate":
      return "Intermediate";
    case "tough":
      return "Advanced";
    default:
      return intensity;
  }
};
