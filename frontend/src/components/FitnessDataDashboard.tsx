// import { useState, useEffect } from "react";
// import googleFitService from "../services/googleFitService";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import GoogleFitConnector from "./GoogleFitConnector";

// interface StepsData {
//   date: string;
//   steps: number;
// }

// interface CaloriesData {
//   date: string;
//   calories: number;
// }

// interface ChartData {
//   date: string;
//   steps?: number;
//   calories?: number;
// }

// const FitnessDataDashboard: React.FC = () => {
//   const [isGoogleFitConnected, setIsGoogleFitConnected] =
//     useState<boolean>(false);
//   const [chartData, setChartData] = useState<ChartData[]>([]);
//   const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
//     start: getLastWeekDate(),
//     end: getCurrentDate(),
//   });
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Helper functions for date handling
//   function getCurrentDate(): string {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   }

//   function getLastWeekDate(): string {
//     const date = new Date();
//     date.setDate(date.getDate() - 7);
//     return date.toISOString().split("T")[0];
//   }

//   // Handle connection status change from GoogleFitConnector
//   const handleConnectionChange = (isConnected: boolean) => {
//     setIsGoogleFitConnected(isConnected);
//     if (isConnected) {
//       fetchFitnessData();
//     } else {
//       setChartData([]);
//     }
//   };

//   // Fetch fitness data from Google Fit
//   const fetchFitnessData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const steps = await googleFitService.getStepsData(
//         dateRange.start,
//         dateRange.end
//       );
//       const calories = await googleFitService.getCaloriesData(
//         dateRange.start,
//         dateRange.end
//       );

//       combineChartData(steps, calories);
//     } catch (error) {
//       console.error("Error fetching fitness data:", error);
//       setError(
//         "Failed to fetch fitness data. Please try reconnecting Google Fit."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Combine steps and calories data for the chart
//   const combineChartData = (steps: StepsData[], calories: CaloriesData[]) => {
//     const dateMap = new Map<string, ChartData>();

//     // Add steps data
//     steps.forEach((item) => {
//       dateMap.set(item.date, { date: item.date, steps: item.steps });
//     });

//     // Add calories data
//     calories.forEach((item) => {
//       if (dateMap.has(item.date)) {
//         dateMap.get(item.date)!.calories = item.calories;
//       } else {
//         dateMap.set(item.date, { date: item.date, calories: item.calories });
//       }
//     });

//     // Convert map to array and sort by date
//     const combined = Array.from(dateMap.values()).sort((a, b) =>
//       a.date.localeCompare(b.date)
//     );

//     setChartData(combined);
//   };

//   // Handle date range change
//   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setDateRange((prev) => ({ ...prev, [name]: value }));
//   };

//   // Refetch data when date range changes
//   useEffect(() => {
//     if (isGoogleFitConnected) {
//       fetchFitnessData();
//     }
//   }, [dateRange]);

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         Fitness Data Dashboard
//       </h2>

//       <GoogleFitConnector onConnectionChange={handleConnectionChange} />

//       {isGoogleFitConnected && (
//         <>
//           <div className="flex flex-wrap gap-4 mb-6">
//             <div className="flex-1">
//               <label
//                 htmlFor="start"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 id="start"
//                 name="start"
//                 value={dateRange.start}
//                 onChange={handleDateChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div className="flex-1">
//               <label
//                 htmlFor="end"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 id="end"
//                 name="end"
//                 value={dateRange.end}
//                 onChange={handleDateChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={fetchFitnessData}
//                 disabled={isLoading}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
//               >
//                 {isLoading ? "Loading..." : "Refresh Data"}
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="mb-6 bg-red-50 p-4 rounded-md">
//               <p className="text-red-600">{error}</p>
//             </div>
//           )}

//           {chartData.length > 0 ? (
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Steps</h3>
//               <div className="h-80 mb-8">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={chartData}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis yAxisId="left" />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="steps"
//                       stroke="#8884d8"
//                       activeDot={{ r: 8 }}
//                       name="Steps"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Calories Burned
//               </h3>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={chartData}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis yAxisId="left" />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="calories"
//                       stroke="#82ca9d"
//                       activeDot={{ r: 8 }}
//                       name="Calories"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-10">
//               {isLoading ? (
//                 <div className="flex justify-center items-center">
//                   <svg
//                     className="animate-spin h-8 w-8 text-blue-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                 </div>
//               ) : (
//                 <p className="text-gray-500">
//                   No fitness data available for the selected date range.
//                 </p>
//               )}
//             </div>
//           )}
//         </>
//       )}

//       {!isGoogleFitConnected && !isLoading && (
//         <div className="text-center py-10">
//           <p className="text-gray-500">
//             Connect Google Fit to view your fitness data.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FitnessDataDashboard;
