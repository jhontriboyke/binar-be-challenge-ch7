import React from "react";
import {
  FaSignOutAlt,
  FaKey,
  FaHome,
  FaPersonBooth,
  FaUserCircle,
} from "react-icons/fa";
import Notification from "../components/Notification";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = ({ email }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FaHome className="mr-2" /> Home
        </button>
        <button
          onClick={() => navigate("/change-password")}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FaKey className="mr-2" /> Change Password
        </button>
        <button
          onClick={() => {
            toast.success("Logout success", {
              autoClose: 1500,
            });
            setTimeout(() => {
              logout();
            }, 1700);
          }}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex flex-row gap-2 items-center">
          <FaUserCircle size={20} />
          <span>{email}</span>
        </div>
        <Notification />
      </div>
    </nav>
  );
};

export default Navbar;
