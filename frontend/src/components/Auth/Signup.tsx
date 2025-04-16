import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-10">
      <div className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">Create Account</h2>
          <p className="text-gray-600 mt-2">
            Join Fitness Tracker and start your journey
          </p>
        </div>

        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
              card: "bg-white",
              headerTitle: "text-indigo-600",
              headerSubtitle: "text-gray-600",
              formFieldInput:
                "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Signup;
