import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import React from "react";
import {
  FaDumbbell,
  FaHeartbeat,
  FaRunning,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: <FaDumbbell className="text-2xl text-indigo-500" />,
      title: "Workout Tracking",
      description:
        "Log and monitor your workouts with ease, including sets, reps, and weights.",
    },
    {
      icon: <FaHeartbeat className="text-2xl text-red-500" />,
      title: "Health Metrics",
      description:
        "Track your vital health metrics like heart rate, blood pressure, and more.",
    },
    {
      icon: <FaRunning className="text-2xl text-green-500" />,
      title: "Activity Goals",
      description:
        "Set personal fitness goals and track your progress toward achieving them.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="relative px-6 pt-16 pb-24 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Your Personal
              <span className="block text-indigo-600">Fitness Journey</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
              Track your workouts, monitor your progress, and achieve your
              fitness goals with our comprehensive fitness tracker.
            </p>

            <div className="mt-10">
              <SignedOut>
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-block rounded-lg bg-white px-6 py-3 text-indigo-600 font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="space-x-4">
                  <Link
                    to="/dashboard"
                    className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Go to Dashboard <FaArrowRight className="inline ml-2" />
                  </Link>
                  <SignOutButton>
                    <button className="rounded-lg bg-white px-6 py-3 text-gray-600 font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Our fitness tracker offers everything you need to stay on top of
              your fitness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your fitness journey?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their lives
            with our fitness tracker.
          </p>
          <SignedOut>
            <Link
              to="/signup"
              className="inline-block bg-white text-indigo-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="inline-block bg-white text-indigo-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <FaHeartbeat className="text-indigo-400 text-2xl mr-2" />
                <span className="text-xl font-bold">Fitness Tracker</span>
              </div>
              <p className="mt-2 text-gray-400 max-w-xs">
                Your all-in-one solution for tracking fitness progress and
                achieving your goals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Fitness Tracker. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
