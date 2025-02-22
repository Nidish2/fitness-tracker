import React from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function Dashboard() {
  return (
    <div>
      <SignedIn>
        <h2>Dashboard</h2>
        <p>Welcome to your dashboard!</p>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}

export default Dashboard;
