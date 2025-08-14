import React, { ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { useAuthProvider } from "../hooks/useAuthProvider";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();

  const value: AuthContextType = {
    ...auth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};
