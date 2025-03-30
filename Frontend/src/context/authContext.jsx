import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Check for existing token in localStorage on app load
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Validate token (placeholder for actual validation logic)
        const isValid = true; // Replace with real validation logic
        if (isValid) {
          setUser({ token }); // Set user state if token is valid
        } else {
          throw new Error("Invalid token");
        }
      } catch (err) {
        setError(err.message); // Set error state if token is invalid
        localStorage.removeItem("authToken"); // Clear invalid token
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("authToken", userData.token); // Save token to localStorage
    setError(null); // Clear any previous errors
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken"); // Clear token on logout
    setError(null); // Clear any previous errors
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
