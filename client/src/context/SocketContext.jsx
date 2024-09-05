// context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (authToken) {
      const decoded = jwtDecode(authToken);

      // Inisialisasi socket dengan mengirimkan token atau user id sebagai query
      const newSocket = io("http://localhost:8000", {
        query: { id: decoded.id },
      });

      // Set the socket state
      setSocket(newSocket);

      // Cleanup the socket when the component unmounts
      return () => {
        newSocket.disconnect();
      };
    }
  }, [authToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
