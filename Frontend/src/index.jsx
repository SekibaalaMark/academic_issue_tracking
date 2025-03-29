import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoverPage from "./pages/CoverPage";
import RoleSelection from "./pages/RoleSelection";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubmitIssue from "./pages/SubmitIssue";
import IssueStatus from "./pages/IssueStatus";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-issue" element={<SubmitIssue />} />
          <Route path="/issue-status" element={<IssueStatus />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
