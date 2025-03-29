import React, { useState } from "react";
import { Card, CardContent } from "@mui/material"; // Ensure @mui/material is installed
import AcademicRegistrar from "./pages/AcademicRegistrar"; // Use relative path if alias fails
import Dashboard from "./pages/Dashboard"; // Ensure file exists
import CoverPage from "./components/CoverPage";
import SignInPage from "./components/SignInPage";

function App() {
  // State declarations
  const [role, setRole] = useState(null); // Tracks selected role
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status

  // Handlers
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  // Render logic
  return (
    <div>
      {!role && !isLoggedIn && <CoverPage onSelectRole={handleRoleSelection} />}
      {role && !isLoggedIn && <SignInPage role={role} onLogin={handleLogin} />}
      {isLoggedIn && <Dashboard role={role} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
