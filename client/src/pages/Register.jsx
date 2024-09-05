import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  return (
    <>
      <div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <RegisterForm />
        <div>
          <p>
            Already have account?{" "}
            <Link className="underline text-sky-600" to={"/login"}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
