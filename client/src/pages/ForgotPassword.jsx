import React, { useState } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  return (
    <main className=" ">
      <ToastContainer />
      <div className="min-h-screen grid place-items-center ">
        {isSuccess ? (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
              Please Check Your Inbox
            </h2>
            <p className="text-center text-gray-600">
              We have sent you a reset password link. Please follow the
              instructions in the email to reset your password.
            </p>
            <div>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-8 hover:bg-blue-600 transition-colors">
                <Link to="/login">Close</Link>
              </button>
            </div>
          </div>
        ) : (
          <ResetPasswordForm handleIsSuccess={() => setIsSuccess(true)} />
        )}
      </div>
    </main>
  );
}
