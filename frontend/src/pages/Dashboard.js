import React from "react";
import { useUser } from "@clerk/clerk-react";
import PersonalDetails from "../components/Dashboard/PersonalDetails";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName || "User"}</h1>
      <PersonalDetails />
    </div>
  );
};

export default Dashboard;
