import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// Create the auth context and export it
export const AuthContext = createContext(null);

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Fix the API call - headers should be outside the data object
          const response = await axios.get(
            "https://academic-6ea365e4b745.herokuapp.com/api/user/", // Use GET for fetching user data
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          console.log("User data fetched:", response.data);
          
          // Set user data with token and authentication status
          setUser({
            ...response.data,
            token,
            isAuthenticated: true
          });
        } else {
          console.log("No token found, user may need to log in.");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
        
        // If token is invalid, clear authentication
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.setItem("isAuthenticated", "false");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated on component mount
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (isAuthenticated) {
      fetchUserData();
    } else {
      // If not authenticated, check if we have user data in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user data:", e);
        }
      }
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (userData) => {
    try {
      setUser({
        ...userData,
        isAuthenticated: true
      });
      
      // Store authentication data
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Store tokens separately for easier access
      if (userData.token) {
        localStorage.setItem("accessToken", userData.token);
      }
      
      if (userData.refreshToken) {
        localStorage.setItem("refreshToken", userData.refreshToken);
      }
      
      // Store role for role-based navigation
      if (userData.role) {
        localStorage.setItem("userRole", userData.role);
      }
      
      // Don't navigate here - let the component handle navigation
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    
    // Clear all authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    
    // Don't navigate here - let the component handle navigation
    return true;
  };

  // Register function
  const register = async (userData) => {
    try {
      // You might want to add API call for registration here
      // For now, just login with the provided data
      return await login(userData);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register.");
      return false;
    }
  };

  // Auth context value
  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error,
    setError // Include setError to allow components to clear errors
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for child components to get the auth object and re-render when it changes
export const useAuth = () => {
  return useContext(AuthContext);
};
