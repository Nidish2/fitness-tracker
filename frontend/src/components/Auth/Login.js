import { SignIn } from "@clerk/clerk-react";

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <SignIn afterSignInUrl="/dashboard" />
    </div>
  );
}

export default Login;
