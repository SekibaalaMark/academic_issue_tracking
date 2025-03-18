import React, { createContext, useState, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  const login = (userData) => {
    setAuthState(userData);
  };

  const logout = () => {
    setAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
