import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || '';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Login function
  const login = (userData, role) => {
    setUser(userData);
    setUserRole(role);
    setIsAuthenticated(true);
    
    // Update localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setUserRole('');
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  };
  
  // Create a memoized value for the context
  const value = useMemo(() => ({
    isAuthenticated,
    userRole,
    user,
    login,
    logout
  }), [isAuthenticated, userRole, user]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
