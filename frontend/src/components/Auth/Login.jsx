import { SignIn } from "@clerk/clerk-react";
import React from "react";
import { FaDumbbell, FaRunning } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-6 text-center">
            <div className="flex justify-center space-x-2 mb-3">
              <FaDumbbell className="text-white text-3xl" />
              <FaRunning className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-indigo-200 mt-1">
              Sign in to continue your fitness journey
            </p>
          </div>

          <div className="p-6">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
                  formFieldInput:
                    "rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
                  card: "shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-gray-300 hover:bg-gray-50",
                  dividerText: "text-xs text-gray-500",
                  footerAction: "text-indigo-600 hover:text-indigo-700",
                },
              }}
              afterSignInUrl="/dashboard"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              Sign up now
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
