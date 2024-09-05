import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = ({ handleIsSuccess }) => {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  // useMutation to handle the forgot password request
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await axios.post(
        "http://localhost:8000/auth/forgot-password",
        values
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        autoClose: 1500,
      });
      handleIsSuccess();
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    },
  });

  const handleBack = () => {};

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <button
        className="absolute top-8 left-8 w-fit bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600 transition-colors"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
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

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${
                mutation.isPending
                  ? "cursor-wait bg-blue-400 hover:bg-blue-400"
                  : ""
              }`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
