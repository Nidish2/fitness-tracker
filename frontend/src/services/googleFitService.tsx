// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// declare global {
//   interface Window {
//     Clerk?: {
//       session?: {
//         getToken(): Promise<string>;
//       };
//     };
//   }
// }

// class GoogleFitService {
//   private async getAuthToken(): Promise<string> {
//     try {
//       const token = await window.Clerk?.session?.getToken();
//       return token || "";
//     } catch (error) {
//       console.error("Error getting authentication token:", error);
//       return "";
//     }
//   }

//   private async makeRequest(
//     method: string,
//     endpoint: string,
//     data?: Record<string, unknown>
//   ) {
//     const token = await this.getAuthToken();

//     const response = await axios({
//       method,
//       url: `${API_BASE_URL}${endpoint}`,
//       data,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     });

//     return response.data;
//   }

//   async checkConnectionStatus(): Promise<boolean> {
//     try {
//       const response = await this.makeRequest("GET", "/googlefit/status");
//       return response.isConnected;
//     } catch (error) {
//       console.error("Error checking Google Fit connection:", error);
//       return false;
//     }
//   }

//   async getAuthUrl(): Promise<string> {
//     try {
//       const response = await this.makeRequest("GET", "/googlefit/auth");
//       return response.authUrl;
//     } catch (error) {
//       console.error("Error getting Google Fit auth URL:", error);
//       throw error;
//     }
//   }

//   async getStepsData(
//     startDate: string,
//     endDate: string
//   ): Promise<Array<{ date: string; steps: number }>> {
//     try {
//       const response = await this.makeRequest(
//         "GET",
//         `/googlefit/steps?startDate=${startDate}&endDate=${endDate}`
//       );
//       return response.stepsData;
//     } catch (error) {
//       console.error("Error fetching steps data:", error);
//       if (axios.isAxiosError(error) && error.response?.data?.needsAuth) {
//         throw new Error("Google Fit authentication required");
//       }
//       throw error;
//     }
//   }

//   async getCaloriesData(
//     startDate: string,
//     endDate: string
//   ): Promise<Array<{ date: string; calories: number }>> {
//     try {
//       const response = await this.makeRequest(
//         "GET",
//         `/googlefit/calories?startDate=${startDate}&endDate=${endDate}`
//       );
//       return response.caloriesData;
//     } catch (error) {
//       console.error("Error fetching calories data:", error);
//       if (axios.isAxiosError(error) && error.response?.data?.needsAuth) {
//         throw new Error("Google Fit authentication required");
//       }
//       throw error;
//     }
//   }

//   async disconnectGoogleFit(): Promise<void> {
//     try {
//       await this.makeRequest("DELETE", "/googlefit/connection");
//     } catch (error) {
//       console.error("Error disconnecting Google Fit:", error);
//       throw error;
//     }
//   }
// }

// export default new GoogleFitService();
