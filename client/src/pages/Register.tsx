import { useEffect } from "react";
import { useLocation } from "wouter";
import Login from "./Login";

export default function Register() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the unified OTP onboarding flow
    setLocation("/login?role=farmer");
  }, [setLocation]);

  return <Login />;
}
