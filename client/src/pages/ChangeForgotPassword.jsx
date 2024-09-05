import React, { useEffect, useState } from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function ChangeForgotPassword() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const [isTokenValid, setTokenValid] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/auth/check-reset-password-token?token=${token}`
      );
      return response.data;
    },
    onSuccess: (response) => {
      setTokenValid(true); // Set token as valid if successful
    },
    onError: (error) => {
      setTokenValid(false); // Set token as invalid if error occurs
    },
  });

  useEffect(() => {
    if (token) {
      mutation.mutate();
    }
  }, [token]); // Add token as a dependency to useEffect

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen grid place-items-center">
        {isTokenValid === null ? (
          <p>Loading...</p>
        ) : isTokenValid ? (
          <ChangePasswordForm token={token} path={"change-forgot-password"} />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text text-center mb-6">
              Your session is over, please re-submit reset password again
            </h2>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors`}
              disabled={mutation.isLoading}
            >
              <Link to="/forgot-password">Forgot Password</Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
