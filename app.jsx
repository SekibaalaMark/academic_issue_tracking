import React, { useState } from "react";
import { Card, CardContent } from "@mui/material"; // Ensure @mui/material is installed
import AcademicRegistrar from "./pages/AcademicRegistrar"; // Use relative path if alias fails
import Dashboard from "./pages/Dashboard"; // Ensure file exists
import CoverPage from "./components/CoverPage"; // SignInPage removed

function App() {
  // State declarations
  const [role, setRole] = useState(null); // Tracks selected role
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status

  // Handlers
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true); // Automatically log in after role selection
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  // Render logic
  return (
    <div>
      {!isLoggedIn && <CoverPage onSelectRole={handleRoleSelection} />}
      {isLoggedIn && <Dashboard role={role} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
