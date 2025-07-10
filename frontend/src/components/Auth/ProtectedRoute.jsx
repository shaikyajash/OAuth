import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("PrivateRoute user:", user);

  if (loading) {
    // Optionally, show a loading spinner or message while auth status is loading
    return <div>Loading...</div>;
  }

  if (!user) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default PrivateRoute;
