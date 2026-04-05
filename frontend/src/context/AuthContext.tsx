import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "chef" | "surplus" | "viewer" | "admin";
  phone?: string;
  location?: string;
  organization?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string,
    phone?: string,
    location?: string,
    organization?: string
  ) => Promise<{ success: boolean; message: string; demoUsers?: any[] }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; hint?: string }>;
  loginWithGoogle: (googleToken: string, email: string, name: string) => Promise<{ success: boolean; message: string; hint?: string }>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string,
    phone?: string,
    location?: string,
    organization?: string
  ): Promise<{ success: boolean; message: string; demoUsers?: any[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role,
          phone,
          location,
          organization,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Registration failed", demoUsers: data.demoUsers };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Registration failed. Please try again." };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; hint?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Login failed", hint: data.hint };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const loginWithGoogle = async (googleToken: string, email: string, name: string): Promise<{ success: boolean; message: string; hint?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleToken, email, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Google login failed" };
      }
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, message: "Google login failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const getCurrentUser = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      logout();
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
