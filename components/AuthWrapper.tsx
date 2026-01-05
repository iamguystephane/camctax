"use client";

import { useAuth } from "@/hooks/useAuth";
import FullScreenLoading from "./FullScreenLoading";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <FullScreenLoading />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
