import { SignUp, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const SignUpPage = () => {
  const { isSignedIn } = useAuth();

  // Redirect to dashboard if already signed in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800">Fitness Tracker</h1>
          <p className="text-gray-600 mt-2">Start your fitness journey today</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <SignUp
            path="/signup"
            routing="path"
            signInUrl="/signin"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-8",
                headerTitle: "text-2xl font-bold text-center text-gray-800",
                headerSubtitle: "text-center text-gray-600",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                footerAction: "text-blue-600 hover:text-blue-800",
              },
            }}
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Join us and transform your fitness routine with personalized
            workouts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
