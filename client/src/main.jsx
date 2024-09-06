import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Homepage.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedComponent.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ChangeForgotPassword from "./pages/ChangeForgotPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute requiresAuth={true}>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/change-password",
        element: (
          <ProtectedRoute requiresAuth={true}>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute requiresAuth={false}>
        <Register />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requiresAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/change-forgot-password",
    element: <ChangeForgotPassword />,
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </SocketProvider>
  </AuthProvider>
);
