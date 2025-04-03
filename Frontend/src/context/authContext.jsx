import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// Create the auth context and export it
export const AuthContext = createContext(null);

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    const fetchUserData  = async () => { // Corrected function name
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get("http://127.0.0.1:8000/api/user/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser (response.data); // Set user data from response
        } else {
          console.error("No token found, user may need to log in.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated on component mount
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      fetchUserData(); // Call the corrected function
    } else {
      setLoading(false); // If not authenticated, just set loading to false
    }
  }, []);

  // Login function
  const login = (userData) => {
    setUser (userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", userData.token); // Store token if available
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  // Logout function
  const logout = () => {
    setUser (null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken"); // Clear token on logout
    navigate("/login"); // Redirect to login page after logout
  };

  // Register function
  const register = (userData) => {
    // You might want to add more logic here
    login(userData);
  };

  // Auth context value
  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error, // Include error in context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Hook for child components to get the auth object and re-render when it changes
export const useAuth = () => {
  return useContext(AuthContext);
};