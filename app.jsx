import React, { useState } from "react";
import CoverPage from "./components/CoverPage";
import SignInPage from "./components/SignInPage";
import Dashboard from "./components/Dashboard";

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
