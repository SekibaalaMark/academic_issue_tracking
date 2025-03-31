import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from ".App"; // Your main app with all other pages
import RoleSelection from "./pages/RoleSelection";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Standalone Role Selection Page */}
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Main App with Navigation */}
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
