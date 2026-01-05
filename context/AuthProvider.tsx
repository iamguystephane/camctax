"use client";

import { API_URL } from "@/API";
import { useState, createContext, ReactNode, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/context/SocketProvider";

interface userProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  mustChangePassword?: boolean;
  coverage?: string[];
}

interface authProps {
  user: userProps;
  setUser: React.Dispatch<React.SetStateAction<userProps>>;
  isLoadingUser: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const authContext = createContext<authProps | undefined>(undefined);

const emptyUser: userProps = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  mustChangePassword: false,
  coverage: [],
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userProps>(emptyUser);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();
  const socketContext = useContext(SocketContext);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/get-user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        // If the response is not ok (e.g., 401, 404, 500), user is not authenticated
        setIsLoadingUser(false);
        return;
      }

      const data = await res.json();
      if (!data?.success || !data?.userData) {
        setIsLoadingUser(false);
        return;
      }
      setUser(data.userData);
    } catch (error) {
      // Silently handle network errors (e.g., API not available, CORS issues)
      // This is expected in development when backend is not running
      console.debug("User authentication check failed (API may not be available):", error);
      setIsLoadingUser(false);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const refetchUser = async () => {
    setIsLoadingUser(true);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(emptyUser);
    router.push("/auth");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Join consultant room when user is authenticated and is a consultant
  useEffect(() => {
    if (user.id && user.role === 'consultant' && socketContext?.socket) {
      socketContext.socket.emit('join-consultant', user.id);
      console.log(`Consultant ${user.id} joined socket room`);
    }
  }, [user.id, user.role, socketContext?.socket]);

  return (
    <authContext.Provider value={{ user, setUser, isLoadingUser, logout, refetchUser }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
