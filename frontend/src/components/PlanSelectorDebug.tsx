import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface ApiResponseType {
  error?: string;
  response?: unknown;
  [key: string]: unknown;
}

const AuthDebugger = () => {
  const [token, setToken] = useState<string>("");
  const [tokenStatus, setTokenStatus] = useState<string>("Not checked");
  const [apiResponse, setApiResponse] = useState<ApiResponseType | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token") || "";
    setToken(storedToken);
  }, []);

  // Test the token validity
  const testToken = async () => {
    if (!token) {
      setTokenStatus("No token available");
      return;
    }

    try {
      setLoading(true);
      // Try to decode token locally
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        setTokenStatus("Invalid token format (not a valid JWT)");
        setLoading(false);
        return;
      }

      // Decode payload (middle part)
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiration = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();

        if (expiration < now) {
          setTokenStatus(
            `Token expired on ${new Date(expiration).toLocaleString()}`
          );
        } else {
          setTokenStatus(
            `Token valid until ${new Date(expiration).toLocaleString()}`
          );
        }
      } catch {
        setTokenStatus("Could not decode token payload");
      }

      // Test against API
      const response = await axios.get("/api/health", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApiResponse(response.data);
    } catch (error) {
      console.error("Error testing token:", error);
      setApiResponse({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Test API connection with token
  const testApi = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApiResponse(response.data);
    } catch (error) {
      console.error("Error testing API:", error);
      setApiResponse({
        error: error instanceof Error ? error.message : "Unknown error",
        response: error && typeof error === 'object' && 'response' in error ? 
          (error as AxiosError<unknown>).response?.data : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Authentication Debugger</h2>

      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">JWT Token</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your JWT token"
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              localStorage.setItem("auth_token", token);
              alert("Token saved to localStorage");
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            Save
          </button>
        </div>
        <p className="mb-4">
          Token Status: <span className="font-medium">{tokenStatus}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={testToken}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Test Token
          </button>
          <button
            onClick={testApi}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            disabled={loading}
          >
            Test API With Token
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {apiResponse && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">API Response:</h3>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Check if your token is valid and not expired</li>
          <li>Verify that API calls include the Authorization header</li>
          <li>Ensure CORS is properly configured on the server</li>
          <li>Check that the verifyClerkJWT middleware is working correctly</li>
          <li>Examine server logs for authentication errors</li>
          <li>Test the /api/health endpoint to verify API connectivity</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthDebugger;
