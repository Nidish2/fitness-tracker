import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Home from "./pages/Home.tsx";
import "./App.css";
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./components/Auth/Login.tsx";
import Signup from "./components/Auth/Signup.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth routes with proper redirects */}
            <Route
              path="/login"
              element={
                isSignedIn ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />

            <Route
              path="/signup"
              element={
                isSignedIn ? <Navigate to="/dashboard" replace /> : <Signup />
              }
            />

            {/* Protected dashboard route */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
