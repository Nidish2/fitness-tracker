import PersonalDetails from "../components/Dashboard/PersonalDetails";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
  FaUtensils,
  FaWeight,
  FaChartLine,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - you would replace this with real data from your backend
  const workoutStats = {
    workoutsCompleted: 12,
    totalMinutes: 560,
    caloriesBurned: 4800,
    streakDays: 5,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "workouts", label: "Workouts", icon: <FaDumbbell /> },
    { id: "nutrition", label: "Nutrition", icon: <FaUtensils /> },
    { id: "progress", label: "Progress", icon: <FaWeight /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-lg ${color
            .replace("border-", "bg-")
            .replace("-600", "-100")} text-${color
            .replace("border-", "")
            .replace("-600", "-500")}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-10">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaHeartbeat className="text-indigo-600 text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Fitness Tracker</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center p-3 bg-gray-100 rounded-lg">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user?.firstName || "User"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "U"}
              </div>
            )}
            <div className="ml-3">
              <h3 className="font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-xs text-gray-500">Fitness Enthusiast</p>
            </div>
          </div>
        </div>

        <nav className="mt-4">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} onClick={() => setActiveTab(tab.id)}>
                <button
                  className={`flex items-center w-full p-3 text-left ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="flex items-center justify-center w-full p-2 text-red-500 hover:bg-red-50 rounded-lg">
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your fitness journey
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <FaCog className="inline mr-2" />
              Settings
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              + New Workout
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<FaDumbbell className="text-xl" />}
                title="Workouts Completed"
                value={workoutStats.workoutsCompleted}
                color="border-blue-600"
              />
              <StatCard
                icon={<FaRunning className="text-xl" />}
                title="Total Minutes"
                value={workoutStats.totalMinutes}
                color="border-green-600"
              />
              <StatCard
                icon={<FaHeartbeat className="text-xl" />}
                title="Calories Burned"
                value={workoutStats.caloriesBurned}
                color="border-red-600"
              />
              <StatCard
                icon={<FaChartLine className="text-xl" />}
                title="Current Streak"
                value={`${workoutStats.streakDays} days`}
                color="border-purple-600"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {/* Sample activities - replace with real data */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-start p-4 border-b last:border-0"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                      <FaDumbbell className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Upper Body Workout</h3>
                      <p className="text-sm text-gray-500">
                        Completed 45 min session • 320 calories
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Personal Details
              </h2>
              <PersonalDetails />
            </div>
          </motion.div>
        )}

        {activeTab !== "overview" && (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {tabs.find((t) => t.id === activeTab).label}
            </h2>
            <p className="text-gray-600">
              This section is under development. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
