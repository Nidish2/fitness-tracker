import { useState, useEffect } from "react";
import googleFitService from "../services/googleFitService";

interface Props {
  onConnectionChange?: (isConnected: boolean) => void;
}

const GoogleFitConnector: React.FC<Props> = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnectionStatus();

    // Check if we're coming back from Google auth
    const urlParams = new URLSearchParams(window.location.search);
    const googleFitStatus = urlParams.get("googlefit");

    if (googleFitStatus === "success") {
      // Clear the URL parameter and refresh connection status
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      checkConnectionStatus();
    } else if (googleFitStatus === "error") {
      setError("Failed to connect to Google Fit. Please try again.");
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const status = await googleFitService.checkConnectionStatus();
      setIsConnected(status);
      if (onConnectionChange) {
        onConnectionChange(status);
      }
    } catch (error) {
      console.error("Error checking Google Fit status:", error);
      setError("Failed to check Google Fit connection status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const authUrl = await googleFitService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Google Fit:", error);
      setError("Failed to initialize Google Fit connection.");
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await googleFitService.disconnectGoogleFit();
      setIsConnected(false);
      if (onConnectionChange) {
        onConnectionChange(false);
      }
    } catch (error) {
      console.error("Error disconnecting Google Fit:", error);
      setError("Failed to disconnect Google Fit.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Google Fit Integration
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center mb-4">
        <div className="flex-1">
          <p className="text-gray-700">
            {isConnected
              ? "Your Google Fit account is connected. You can now import your fitness data."
              : "Connect your Google Fit account to import your fitness data."}
          </p>
        </div>
        <div>
          {isLoading ? (
            <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : isConnected ? (
            <button
              onClick={handleDisconnect}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="text-sm text-gray-500">
          <p>
            You can track your daily steps, calories burned, and more from your
            Google Fit account.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleFitConnector;
