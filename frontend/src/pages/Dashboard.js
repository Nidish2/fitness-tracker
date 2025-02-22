import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

function Dashboard() {
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        console.log("Clerk Session Token:", token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, [getToken]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard! Check the console for your token.</p>
    </div>
  );
}

export default Dashboard;
