import { useContext } from "react";
import { authContext } from "@/context/AuthProvider";

export const useAuth = () => {
  const auth = useContext(authContext);
  if (!auth)
    throw new Error("useAuth must be used inside AuthProvider");
  return auth;
};
