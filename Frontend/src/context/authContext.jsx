"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      try {
        // Try to get user data from localStorage instead of API
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Create a mock user based on available data
          const username = localStorage.getItem("username");
          const userRole = localStorage.getItem("userRole");
          const token = localStorage.getItem("accessToken");

          if (username || userRole || token) {
            setUser({
              username: username || "user",
              role: userRole || "lecturer",
              token: token,
              email: `${username || "user"}@example.com`,
            });
          }
        }
      } catch (err) {
        console.error("Error parsing stored user data:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, role) => {
    // Set user data in state
    setUser(userData);

    // Store authentication data
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", userData.token);

    if (userData.username) {
      localStorage.setItem("username", userData.username);
    }

    // Store role with fallbacks
    const userRole = userData.user_role || userData.role || role || "student";
    localStorage.setItem("userRole", userRole);

    // Navigate based on role
    switch (userRole) {
      case "student":
        navigate("/students");
        break;
      case "lecturer":
        navigate("/lecturers");
        break;
      case "academicregistrar":
        navigate("/registrar");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const register = (userData) => {
    login(userData);
  };

  // Mock implementation that doesn't rely on API
  const handleFormSubmission = async (
    url,
    data,
    method = "post",
    successCallback = null
  ) => {
    try {
      console.log(
        `Mock ${method.toUpperCase()} request to ${url} with data:`,
        data
      );

      // Create a mock response
      const mockResponse = {
        success: true,
        message: "Operation completed successfully",
        data: { ...data, id: Math.floor(Math.random() * 1000) },
      };

      if (successCallback) {
        successCallback(mockResponse);
      }

      return {
        success: true,
        data: mockResponse,
      };
    } catch (err) {
      console.error("Form submission error:", err);
      return {
        success: false,
        error: "An error occurred during submission",
      };
    }
  };

  // Mock implementation
  const assignIssue = async (issueId, lecturerId) => {
    return handleFormSubmission(
      `mock-api/issues/${issueId}/assign`,
      { lecturer_id: lecturerId },
      "patch",
      (data) => {
        console.log("Issue assigned:", data);
      }
    );
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error,
    handleFormSubmission,
    assignIssue,
    currentPath: location.pathname,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
