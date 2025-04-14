import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create the auth context
export const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use consistent token naming - check both for backward compatibility
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken");

        if (token) {
          // This should be a GET request to verify the token
          const response = await axios.get(
            "https://academic-6ea365e4b745.herokuapp.com/api/user/profile/", // Adjust endpoint as needed
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("User data fetched:", response.data);
          setUser(response.data);
        } else {
          console.error("No token found, user may need to log in.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");

        // Clear invalid tokens on error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated on component mount
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));

    // Use consistent token naming
    localStorage.setItem("accessToken", userData.token);

    // Store user role for routing decisions
    if (userData.user_role) {
      localStorage.setItem("userRole", userData.user_role);
    }

    // Navigate based on user role
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

  // Logout function
  const logout = () => {
    setUser(null);
    // Clear all auth-related items
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Register function
  const register = (userData) => {
    login(userData);
  };

  // Auth context value
  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Hook for child components to get the auth object
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
