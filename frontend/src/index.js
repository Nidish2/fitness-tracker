import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_FRONTEND_API}>
    <App />
  </ClerkProvider>
);
