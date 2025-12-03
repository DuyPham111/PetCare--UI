import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@shared/types";
import { DEFAULT_MEMBERSHIP_LEVEL } from "@/lib/membershipUtils";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("petcare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const allUsers = JSON.parse(localStorage.getItem("petcare_users") || "[]");
    const foundUser = allUsers.find(
      (u: User) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    setUser(foundUser);
    localStorage.setItem("petcare_user", JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("petcare_user");
    // Always redirect to shared login route on logout
    try {
      // prefer SPA navigation if available
      window.location.href = '/login';
    } catch (e) {
      // no-op
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole) => {
    const allUsers = JSON.parse(localStorage.getItem("petcare_users") || "[]");

    if (allUsers.find((u: User) => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      fullName,
      role,
      membershipLevel: role === "customer" ? DEFAULT_MEMBERSHIP_LEVEL : undefined,
      createdAt: new Date().toISOString(),
    };

    allUsers.push(newUser);
    localStorage.setItem("petcare_users", JSON.stringify(allUsers));
    setUser(newUser);
    localStorage.setItem("petcare_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
