import { useState, useEffect } from "react";
import { getUserDetails, verifyApiConnection } from "../services/userService";
import { getClerkToken } from "../services/authService";

interface UserDetails {
  _id?: string;
  clerkId?: string;
  name?: string;
  age?: number;
  height?: number;
  weight?: number;
  [key: string]: unknown; // For any additional properties
}

const ApiDiagnostic = () => {
  const [testResults, setTestResults] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
    data?: UserDetails | null;
    errors?: string[];
  }>({
    status: "idle",
    message: 'Click "Test API" to verify API connectivity',
  });

  // Function to test both auth endpoint and user details endpoint
  const testApi = async () => {
    setTestResults({
      status: "loading",
      message: "Testing API connection...",
    });

    const errors: string[] = [];
    let userData: UserDetails | null = null;

    try {
      // Step 1: Check if token is available
      const token = await getClerkToken();
      if (!token) {
        throw new Error(
          "Authentication token unavailable - please log in again"
        );
      }

      // Step 2: Test the protected auth endpoint
      try {
        await verifyApiConnection();
        console.log("Auth API connection successful!");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        errors.push(`Auth API error: ${errorMessage}`);
      }

      // Step 3: Test the user details endpoint
      try {
        userData = await getUserDetails();
        console.log("User details API connection successful!", userData);

        if (!userData) {
          errors.push("User details API returned empty response");
        } else if (!userData.clerkId) {
          errors.push(
            "User details doesn't contain clerkId - possible data integrity issue"
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        errors.push(`User details API error: ${errorMessage}`);
      }

      // Determine overall status
      if (errors.length === 0) {
        setTestResults({
          status: "success",
          message: "All API connections successful!",
          data: userData,
        });
      } else {
        setTestResults({
          status: "error",
          message: "Some API tests failed. See details below.",
          data: userData,
          errors: errors,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setTestResults({
        status: "error",
        message: `API connection error: ${errorMessage}`,
        errors: [errorMessage],
      });
    }
  };

  // Check connection on component mount
  useEffect(() => {
    // Optional: Test API automatically when component mounts
    // Uncomment the line below if you want this behavior
    // testApi();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-6 mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        API Diagnostic Tool
      </h2>

      <div className="mb-4">
        <button
          onClick={testApi}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={testResults.status === "loading"}
        >
          {testResults.status === "loading"
            ? "Testing..."
            : "Test API Connection"}
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

        {testResults.errors && testResults.errors.length > 0 && (
          <div className="mt-2">
            <p className="font-medium">Errors:</p>
            <ul className="list-disc pl-5 text-sm">
              {testResults.errors.map((error, idx) => (
                <li key={idx} className="text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {testResults.data && (
          <div className="mt-2">
            <p className="font-medium">User Data:</p>
            <pre className="bg-white p-2 rounded text-sm mt-1 overflow-auto max-h-48">
              {JSON.stringify(testResults.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Troubleshooting Tips:</strong>
        </p>
        <ul className="list-disc ml-5 mt-1">
          <li>
            Make sure your backend server is running at http://localhost:5000
          </li>
          <li>Verify that your MongoDB connection is working properly</li>
          <li>
            Check that your Clerk authentication environment variables are set
            correctly
          </li>
          <li>
            Try signing out and signing back in if authentication issues persist
          </li>
          <li>
            Check browser console and server logs for more detailed errors
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDiagnostic;
