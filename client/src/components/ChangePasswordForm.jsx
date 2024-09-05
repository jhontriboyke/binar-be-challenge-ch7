import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { jwtDecode } from "jwt-decode";

const ChangePasswordForm = ({ token, path }) => {
  const decoded = jwtDecode(token);
  const socket = useSocket();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await axios.post(
        `http://localhost:8000/auth/${path}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, {
        autoClose: 1500,
      });
      let destination = "/login";
      if (path === "change-password") {
        destination = "/";
        socket.emit("new-notification", {
          targetId: decoded.id,
          message: "Password change success",
        });
      }
      setTimeout(() => {
        navigate(destination);
      }, 2500);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage || "An error occurred", {
        autoClose: 1500,
      });
    },
  });

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm new password is required"),
  });

  const onSubmit = (values) => {
    mutation.mutate({ newPassword: values.newPassword });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">
                New Password
              </label>
              <Field
                type="password"
                id="newPassword"
                name="newPassword"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  touched.newPassword && errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Confirm New Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${
                mutation.isLoading && "cursor-wait bg-blue-400"
              }`}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Submitting..." : "Change Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswordForm;
