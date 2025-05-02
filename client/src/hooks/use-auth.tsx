import { createContext, ReactNode, useContext, useState } from "react";
import { User as SelectUser, InsertUser } from "@shared/schema";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simplified implementation for debugging
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Empty mutation handlers to prevent errors
  const loginMutation = {
    mutate: () => {},
    isPending: false,
  };

  const registerMutation = {
    mutate: () => {},
    isPending: false,
  };

  const logoutMutation = {
    mutate: () => {},
    isPending: false,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
