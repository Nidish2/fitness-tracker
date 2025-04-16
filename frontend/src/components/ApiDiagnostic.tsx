import { useState } from "react";
import { getUserDetails } from "../services/userService";

interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  // Add more specific fields as needed
  [key: string]: unknown; // For any additional properties
}

const ApiDiagnostic = () => {
  const [testResults, setTestResults] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
    data?: UserDetails;
  }>({
    status: "idle",
    message: 'Click "Test API" to verify API connectivity',
  });

  const testApi = async () => {
    setTestResults({
      status: "loading",
      message: "Testing API connection...",
    });

    try {
      // Test the API
      const response = await getUserDetails();

      setTestResults({
        status: "success",
        message: "API connection successful!",
        data: response,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setTestResults({
        status: "error",
        message: `API connection failed: ${errorMessage}`,
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        API Diagnostic Tool
      </h2>

      <div className="mb-4">
        <button
          onClick={testApi}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={testResults.status === "loading"}
        >
          {testResults.status === "loading" ? "Testing..." : "Test API"}
        </button>
      </div>

      <div
        className={`p-3 rounded ${
          testResults.status === "idle"
            ? "bg-gray-100"
            : testResults.status === "loading"
            ? "bg-blue-100"
            : testResults.status === "success"
            ? "bg-green-100"
            : "bg-red-100"
        }`}
      >
        <p className="font-medium">{testResults.message}</p>

        {testResults.data && (
          <div className="mt-2">
            <p className="font-medium">Response Data:</p>
            <pre className="bg-white p-2 rounded text-sm mt-1 overflow-auto max-h-48">
              {JSON.stringify(testResults.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Note:</strong> If the test fails, check:
        </p>
        <ul className="list-disc ml-5 mt-1">
          <li>Is your backend server running at http://localhost:5000?</li>
          <li>Is Clerk authentication configured correctly?</li>
          <li>Are your API endpoints defined correctly?</li>
          <li>Check browser console for more detailed errors</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDiagnostic;
