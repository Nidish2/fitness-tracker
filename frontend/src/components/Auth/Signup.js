import { SignUp } from "@clerk/clerk-react";

function Signup() {
  return (
    <div>
      <h2>Signup</h2>
      <SignUp afterSignUpUrl="/dashboard" />
    </div>
  );
}

export default Signup;
