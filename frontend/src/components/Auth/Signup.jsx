import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import React from "react";
import { FaDumbbell, FaHeartbeat, FaRunning } from "react-icons/fa";

function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-teal-600 p-6 text-center">
            <div className="flex justify-center space-x-2 mb-3">
              <FaDumbbell className="text-white text-3xl" />
              <FaHeartbeat className="text-white text-3xl" />
              <FaRunning className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Start Your Fitness Journey
            </h2>
            <p className="text-teal-200 mt-1">
              Create an account to track your progress
            </p>
          </div>

          <div className="p-6">
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-teal-600 hover:bg-teal-700 text-sm normal-case",
                  formFieldInput:
                    "rounded-md border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50",
                  card: "shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-gray-300 hover:bg-gray-50",
                  dividerText: "text-xs text-gray-500",
                  footerAction: "text-teal-600 hover:text-teal-700",
                },
              }}
              afterSignUpUrl="/dashboard"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-teal-600 font-medium hover:text-teal-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
