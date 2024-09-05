import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import OtpModal from "../components/OtpModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <LoginForm />
        <div>
          <p>
            Need new account?{" "}
            <Link className="underline text-sky-600" to={"/register"}>
              Register here
            </Link>
          </p>
        </div>
        <div>
          <p>
            Forgot your password?{" "}
            <Link className="underline text-sky-600" to={"/forgot-password"}>
              Reset password here
            </Link>
          </p>
        </div>
      </div>
      <OtpModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
