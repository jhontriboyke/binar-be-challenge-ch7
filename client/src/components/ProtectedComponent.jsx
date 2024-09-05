import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, requiresAuth }) => {
  const { authToken } = useAuth();

  if (requiresAuth) {
    // Halaman yang memerlukan autentikasi
    if (!authToken) {
      return <Navigate to="/login" replace />;
    }
  } else {
    // Halaman yang tidak memerlukan autentikasi
    if (authToken) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
