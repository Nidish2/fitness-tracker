import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";

function Home() {
  return (
    <div>
      <h1>Welcome to Fitness Tracker</h1>
      <SignedOut>
        <p>
          <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link>
        </p>
      </SignedOut>
      <SignedIn>
        <p>
          <Link to="/dashboard">Go to Dashboard</Link> |{" "}
          <SignOutButton signOutCallback={() => (window.location.href = "/")} />
        </p>
      </SignedIn>
    </div>
  );
}

export default Home;
