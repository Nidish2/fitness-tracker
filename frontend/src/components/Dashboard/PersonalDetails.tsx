import { useState, useEffect } from "react";

interface PersonalDetailsFormProps {
  onSubmit: (details: {
    name: string;
    age: number;
    height: number;
    weight: number;
  }) => void;
  initialValues?: {
    name?: string;
    age?: number;
    height?: number;
    weight?: number;
  };
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  onSubmit,
  initialValues = {},
}) => {
  const [name, setName] = useState(initialValues.name || "");
  const [age, setAge] = useState(initialValues.age?.toString() || "");
  const [height, setHeight] = useState(initialValues.height?.toString() || "");
  const [weight, setWeight] = useState(initialValues.weight?.toString() || "");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update form if initialValues change
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setAge(initialValues.age?.toString() || "");
      setHeight(initialValues.height?.toString() || "");
      setWeight(initialValues.weight?.toString() || "");
    }
  }, [initialValues]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!age) {
      errors.age = "Age is required";
    } else if (
      isNaN(parseInt(age)) ||
      parseInt(age) < 1 ||
      parseInt(age) > 120
    ) {
      errors.age = "Age must be between 1 and 120";
    }

    if (!height) {
      errors.height = "Height is required";
    } else if (
      isNaN(parseFloat(height)) ||
      parseFloat(height) < 1 ||
      parseFloat(height) > 300
    ) {
      errors.height = "Height must be between 1 and 300 cm";
    }

    if (!weight) {
      errors.weight = "Weight is required";
    } else if (
      isNaN(parseFloat(weight)) ||
      parseFloat(weight) < 1 ||
      parseFloat(weight) > 500
    ) {
      errors.weight = "Weight must be between 1 and 500 kg";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const details = {
      name: name.trim(),
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
    };

    onSubmit(details);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full border ${
            formErrors.name ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="1"
          max="120"
          className={`mt-1 block w-full border ${
            formErrors.age ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {formErrors.age && (
          <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="height"
          className="block text-sm font-medium text-gray-700"
        >
          Height (cm)
        </label>
        <input
          type="number"
          id="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          min="1"
          max="300"
          step="0.1"
          className={`mt-1 block w-full border ${
            formErrors.height ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {formErrors.height && (
          <p className="text-red-500 text-xs mt-1">{formErrors.height}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-medium text-gray-700"
        >
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min="1"
          max="500"
          step="0.1"
          className={`mt-1 block w-full border ${
            formErrors.weight ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
        />
        {formErrors.weight && (
          <p className="text-red-500 text-xs mt-1">{formErrors.weight}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Save Details
      </button>
    </form>
  );
};

export default PersonalDetailsForm;
