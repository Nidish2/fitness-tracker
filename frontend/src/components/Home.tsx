import { Link } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Redirect already signed in users to dashboard */}
      <SignedIn>
        <RedirectToSignIn />
      </SignedIn>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-blue-800 mb-6">
            Fitness Tracker
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            Your personal fitness journey starts here. Track workouts, set
            goals, and monitor your progress.
          </p>

          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Ready to transform your fitness routine?
            </h2>

            <p className="text-gray-600 mb-8">
              Join thousands of users who have already improved their fitness
              with our easy-to-use tracking system. Set goals, monitor progress,
              and stay motivated!
            </p>

            <SignedOut>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signin"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </SignedOut>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                Monitor your workouts, see your improvements, and stay
                motivated.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Set Custom Goals</h3>
              <p className="text-gray-600">
                Create personalized fitness goals that match your unique
                journey.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
              <p className="text-gray-600">
                Use our platform on any device - at home, in the gym, or on the
                go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
