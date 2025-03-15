import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if token and user data are stored in localStorage
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log("Token and user loaded from localStorage");
      }
    } catch (error) {
      console.error("Failed to load token and user from localStorage:", error);
    }
  }, []);

  // Function to handle user login
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://your-backend.com/api/login",
        credentials
      );
      const { token, userData } = response.data;
      setToken(token);
      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("Login successful:", userData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await axios.post(
        "http://your-backend.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Function to refresh the authentication token
  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://your-backend.com/api/refresh-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      console.log("Token refreshed:", newToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  // Set up an interval to refresh the token every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        refreshToken();
      }
    }, 15 * 60 * 1000); // Refresh token every 15 minutes

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
