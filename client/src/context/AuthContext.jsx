import { createContext, useContext, useState } from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("hostelUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password, role = "student") => {
    if (!email || !password) {
      return {
        success: false,
        message: "Please enter email and password",
      };
    }

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: {
          email: email.trim(),
          password,
        },
      });

      const userData = {
        ...response.user,
        token: response.token,
        role: response.user?.role || role,
      };

      localStorage.setItem("hostelUser", JSON.stringify(userData));
      setUser(userData);

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const register = async (userDetails) => {
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: {
          name: userDetails.name.trim(),
          email: userDetails.email.trim(),
          phone: userDetails.phone.trim(),
          password: userDetails.password,
          role: userDetails.role || "student",
        },
      });

      const userData = {
        ...response.user,
        token: response.token || null,
      };

      localStorage.setItem("hostelUser", JSON.stringify(userData));
      setUser(userData);

      return {
        success: true,
        user: userData,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("hostelUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}