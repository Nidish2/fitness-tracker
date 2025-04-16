import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">
          Welcome to Fitness Tracker
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-gray-700 mb-6">
            Start your fitness journey today with personalized tracking and
            insights.
          </p>

          <SignedOut>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full md:w-auto text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors w-full md:w-auto text-center"
              >
                Sign Up
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Why Choose Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-indigo-700">
                    Track Progress
                  </h3>
                  <p className="text-gray-600">
                    Monitor your fitness journey with detailed metrics
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-indigo-700">Set Goals</h3>
                  <p className="text-gray-600">
                    Create personalized fitness goals and track completion
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-indigo-700">
                    Stay Motivated
                  </h3>
                  <p className="text-gray-600">
                    Get insights and reminders to keep you on track
                  </p>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <p className="mb-4 text-gray-700">You're already logged in!</p>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Home;
