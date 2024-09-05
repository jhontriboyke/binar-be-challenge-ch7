import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "../context/SocketContext";

export default function Homepage() {
  const location = useLocation();
  const isOutletVisible = location.pathname !== "/";
  const { authToken } = useAuth();
  const decoded = jwtDecode(authToken);
  const socket = useSocket();

  const handleEmit = async () => {
    socket.emit("new-notification", {
      targetId: decoded.id,
      message: "Hello guys",
    });
  };

  return (
    <>
      <ToastContainer />
      <header>
        <Navbar email={decoded.email} />
      </header>
      <main>
        <section className="pl-6 pt-6">
          {!isOutletVisible && (
            <>
              <button
                onClick={handleEmit}
                className="p-2 bg-blue-500 rounded text-white active:scale-95 hover:bg-blue-600 transition-all"
              >
                Send Notif
              </button>
              <h1 className="text-4xl mb-4">Homepage</h1>
              <p className="">
                Welcome Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Nisi nulla itaque aliquid quae? Perspiciatis veniam, quis
                corporis quasi sint dolorum quo corrupti vero nam nesciunt? Odio
                voluptatum dolore neque non?
              </p>
            </>
          )}
          <Outlet />
        </section>
      </main>
    </>
  );
}
