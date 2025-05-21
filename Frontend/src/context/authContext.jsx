import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "https://academic-issue-tracking-now.onrender.com";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data based on role
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found, setting loading to false");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/user/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User data fetched:", response.data);

        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);

        if (err.response?.status === 404) {
          console.error("API endpoint not found. Please check the backend.");
          setError("Unable to fetch user data. Please contact support.");
        } else if (err.response?.status === 401) {
          console.log("Token expired, attempting to refresh...");
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              // Retry fetching user data with the new token
              const response = await axios.get(
                `${BASE_URL}/api/user/profile/`,
                {
                  headers: {
                    Authorization: `Bearer ${newToken}`,
                  },
                }
              );

              console.log(
                "User data fetched after token refresh:",
                response.data
              );

              if (response.data) {
                setUser(response.data);
              }
            }
          } catch (refreshErr) {
            console.error("Error refreshing token:", refreshErr);
            logout();
          }
        } else {
          setUser(null);
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
  }, [navigate, location.pathname]);

  // Login function
  const login = (userData, role) => {
    try {
      if (!userData || !userData.token) {
        throw new Error("Invalid login data received");
      }

      // Store user data
      setUser(userData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("accessToken", userData.token);

      // Store username for fallback display
      if (userData.username) {
        localStorage.setItem("username", userData.username);
      }

      // Determine and store user role
      const userRole = userData.user_role || role || "student";
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
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      console.log("Refreshing access token with refresh token:", refreshToken);

      const response = await axios.post(`${BASE_URL}/token/refresh`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      console.log("New access token received:", access);

      localStorage.setItem("accessToken", access);
      return access;
    } catch (err) {
      console.error("Error refreshing access token:", err);
      logout(); // Log the user out if the refresh fails
    }
  };

  // Handle form submissions
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

      if (successCallback && typeof successCallback === "function") {
        successCallback(response.data);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("Form submission error:", err);

      // Handle authentication errors
      if (err.response?.status === 401) {
        logout();
      }

      return {
        success: false,
        error: err.response?.data || {
          message: "An error occurred during submission",
        },
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    handleFormSubmission,
    refreshAccessToken,
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
