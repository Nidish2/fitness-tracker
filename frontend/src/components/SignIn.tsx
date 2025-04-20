import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const SignInPage = () => {
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
          <p className="text-gray-600 mt-2">
            Track your workouts and fitness journey
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <SignIn
            path="/signin"
            routing="path"
            signUpUrl="/signup"
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
          <p>Ready to achieve your fitness goals? Sign in to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
