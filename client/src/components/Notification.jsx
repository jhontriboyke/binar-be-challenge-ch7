import React, { useEffect, useState } from "react";
import { FaBell, FaCheckSquare, FaMarkdown } from "react-icons/fa";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  const { authToken } = useAuth();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/user/notifications",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchInitialNotifications();
  }, [authToken]);

  useEffect(() => {
    if (socket) {
      socket.on("new-notification", (notification) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      });

      return () => {
        socket.off("new-notification");
      };
    }
  }, [socket]);

  return (
    <div className="relative cursor-pointer">
      <div onClick={toggleDrawer}>
        <FaBell className="text-gray-700 text-2xl " />
        {notifications.length > 0 ? (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.length}
          </span>
        ) : null}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-10">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <ul>
              {notifications.length > 0 &&
                notifications.map((notif) => (
                  <>
                    <li
                      className="p-2 hover:bg-slate-100 flex items-center justify-between "
                      key={notif.id}
                    >
                      {notif.message}
                    </li>
                  </>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
