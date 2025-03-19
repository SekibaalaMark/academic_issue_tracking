import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  const login = async (credentials) => {
    // Replace with actual authentication logic
    if (credentials.username === "admin" && credentials.password === "admin") {
      setAuthState({ username: credentials.username });
      return true;
    }
    return false;
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
