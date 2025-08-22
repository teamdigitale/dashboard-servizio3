// src/pages/Login.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user_store";

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
const mockUser = {
  id: "user-456",
  name: "John Smith",
  email: "john.smith@example.com",
  preferredTheme: "light",
  expiresAt: new Date().getTime() + SESSION_DURATION,
};

const Login: React.FC = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    // In a real app, you would perform authentication here
    console.log("Logging in...");
    setUser(mockUser);
    // Redirect to a protected page after login
    navigate("/");
  };

  return (
    <div className='login-container p-4'>
      <h2 className='text-2xl'>Login Page</h2>
      <p>You must log in to view the dashboard.</p>
      <button className='btn btn-primary' onClick={handleLogin}>
        Log In
      </button>
    </div>
  );
};

export default Login;
