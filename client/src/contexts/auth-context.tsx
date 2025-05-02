import { createContext, ReactNode, useContext, useState } from "react";
import { User as SelectUser, InsertUser } from "@shared/schema";

type LoginData = Pick<InsertUser, "username" | "password">;

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  loginMutation: {
    mutate: (data: LoginData) => void;
    isPending: boolean;
  };
  registerMutation: {
    mutate: (data: InsertUser, options?: any) => void;
    isPending: boolean;
  };
  logoutMutation: {
    mutate: () => void;
    isPending: boolean;
  };
};

const initialAuth: AuthContextType = {
  user: null,
  isLoading: false,
  isLoggedIn: false,
  loginMutation: {
    mutate: () => {},
    isPending: false
  },
  registerMutation: {
    mutate: () => {},
    isPending: false
  },
  logoutMutation: {
    mutate: () => {},
    isPending: false
  }
};

export const AuthContext = createContext<AuthContextType>(initialAuth);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simplified state for testing navigation and layout
  const [authState] = useState<AuthContextType>(initialAuth);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}