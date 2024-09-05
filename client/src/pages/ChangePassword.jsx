import React from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const { authToken } = useAuth();
  return (
    <>
      <ToastContainer />
      <ChangePasswordForm token={authToken} path={"change-password"} />
    </>
  );
}
