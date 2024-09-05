import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpModal from "./OtpModal";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [email, setEmail] = useState(null);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        values
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.need_otp) {
        setIsOtpOpen(true);
        toast.success(response.message, {
          autoClose: 1500,
        });
        return;
      }
      const token = response?.data;
      toast.success("Login success", {
        autoClose: 1500,
      });
      setTimeout(() => {
        login(token);
      }, 2300);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    },
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onSubmit = (values) => {
    setEmail(values.email);
    mutation.mutate(values);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${
                  mutation.isPending &&
                  "cursor-wait hover:bg-blue-400 bg-blue-400"
                }`}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <OtpModal
        email={isOtpOpen ? email : null}
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
      />
    </>
  );
};

export default LoginForm;
