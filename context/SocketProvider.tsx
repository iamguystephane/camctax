"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "@/API";

// Define a generic Socket type to avoid import issues
type Socket = any;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SocketProvider = ({ children }: { children: ReactNode }) => {
const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine socket base URL. Prefer NEXT_PUBLIC_API_URL, then API_URL fallback.
    const fallback = API_URL ? API_URL.replace(/\/api$/, "") : "https://camctax-server.onrender.com";
    const socketBase = process.env.NEXT_PUBLIC_API_URL || fallback;

    // Initialize socket connection with credentials so cookies are sent.
    const newSocket = io(socketBase, {
      transports: ["websocket"],
      reconnection: true,
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
