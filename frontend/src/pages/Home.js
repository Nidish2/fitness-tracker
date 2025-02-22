import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to Fitness Tracker</h1>
      <p>
        <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Home;
