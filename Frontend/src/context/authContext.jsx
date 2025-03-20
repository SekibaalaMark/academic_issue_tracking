import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing token in localStorage on app load
    const token = localStorage.getItem("authToken");
    if (token) {
      setUser({ token }); // Set user state if token exists
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("authToken", userData.token); // Save token to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken"); // Clear token on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
