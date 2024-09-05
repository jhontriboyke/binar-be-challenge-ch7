import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ isOpen, onClose, email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (otpPayload) => {
      const response = await axios.post(
        "http://localhost:8000/auth/verify-otp",
        otpPayload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success("OTP Verified Successfully", {
        autoClose: 1500,
      });
      setIsSuccess(true);

      setTimeout(() => {
        login(response.data);
        navigate("/");
      }, 3500);
      // Redirect or perform other actions here
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      toast.error(errorMessage, {
        autoClose: 1500,
      });
    },
  });

  const handleChange = (element, index) => {
    if (isNaN(element.value) && element.value !== "") return;

    let newOtp = [...otp];
    newOtp[index] = element.value;

    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    mutation.mutate({ email, otp: otpValue });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          {isSuccess ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                OTP Verified
              </h2>
              <p className="text-center text-gray-600 mb-6">
                You will be redirected to homepage soon.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
              <p className="text-center text-gray-600 mb-6">
                Please enter the 4-digit code sent to you
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex justify-center space-x-4"
              >
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </form>
              <button
                onClick={handleSubmit}
                className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                {mutation.isPending ? "Verifying" : "Verify"}
              </button>
              <button
                onClick={onClose}
                className="mt-4 w-full text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default OtpModal;
