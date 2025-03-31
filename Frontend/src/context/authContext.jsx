import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for authentication state on initial load
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedRole = localStorage.getItem("userRole");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Replace with your API call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setUserRole(data.role); // Assuming the API returns the user role
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", data.role);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const register = async (username, password, role) => {
    try {
      // Replace with your API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      // Optionally log in the user after registration
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, login, register, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
