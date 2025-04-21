import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await axios.get(
            "https://academic-6ea365e4b745.herokuapp.com/api/user/profile/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");
          navigate("/login");
        } else {
          setError("Failed to fetch user data. Please try refreshing.");
        }
      } finally {
        setLoading(false);
      }
    };

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, role) => {
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", userData.token);
    if (userData.user_role) {
      localStorage.setItem("userRole", userData.user_role);
    }
    const userRole = userData.user_role || "student";
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
    navigate("/login");
  };

  const register = (userData) => {
    login(userData);
  };

  const handleFormSubmission = async (
    url,
    data,
    method = "post",
    successCallback = null
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      let response;
      if (method.toLowerCase() === "post") {
        response = await axios.post(url, data, config);
      } else if (method.toLowerCase() === "put") {
        response = await axios.put(url, data, config);
      } else if (method.toLowerCase() === "patch") {
        response = await axios.patch(url, data, config);
      } else {
        throw new Error("Unsupported method");
      }

      if (successCallback) {
        successCallback(response.data);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("Form submission error:", err);
      return {
        success: false,
        error: err.response?.data || "An error occurred during submission",
      };
    }
  };

  const assignIssue = async (issueId, lecturerId) => {
    try {
      const response = await handleFormSubmission(
        `https://academic-6ea365e4b745.herokuapp.com/api/issues/${issueId}/assign`,
        { lecturer_id: lecturerId },
        "patch",
        (data) => {
          console.log("Issue assigned:", data);
        }
      );
      return response;
    } catch (err) {
      console.error("Issue assignment error:", err);
      return {
        success: false,
        error: err.response?.data || "Failed to assign issue.",
      };
    }
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
