import React from "react";
import "./App.css"; // Import global styles
import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom"; // Import useNavigate and useLocation for navigation
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material"; // Import Material-UI components

import AcademicRegistrar from "@/pages/AcademicRegistrar";
import Dashboard from "./pages/Dashboard"; // Academic Registrar Dashboard
import { AuthProvider, useAuth } from "@/context/authContext"; // Auth Context
import ForgotPassword from "@/features/authentication/ForgotPassword.jsx"; // Forgot Password Page
import Lecturers from "@/ui/Lecturers/Lecturers.jsx"; // Lecturer Dashboard
import Login from "@/pages/Login.jsx"; // Login Page
import RegisterForm from "@/pages/RegisterForm.jsx"; // Registration Page
import StudentDashboard from "@/ui/StudentDashboard/StudentDashboard.jsx"; // Student Dashboard
import StudentComplaints from "@/ui/StudentComplaints/StudentComplaints.jsx"; // Student Complaints Page
import Navbar from "./components/Navbar"; // Navbar Component
import Home from "@/pages/Home"; // Home Page
import CoverPage from "./pages/CoverPage"; // Import CoverPage component
import RoleSelectionPage from "@/pages/RoleSelectionPage"; // Ensure correct import path
import ReactDOM from "react-dom";
// import graduationImage from "@/assets/graduationImage/graduation1.png";

import { BrowserRouter } from "react-router-dom";

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>; // Uncommented for debugging
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Uncommented for debugging
  }

  return <Outlet />;
};

function App() {
  const location = useLocation(); // Get the current route

  return (
    <AuthProvider>
      {/* Conditionally render the navigation bar */}
      {location.pathname !== "/login" &&
        location.pathname !== "/" &&
        location.pathname !== "/role-selection" && <Navbar />}
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/lecturer" element={<Lecturers />} />
          <Route
            path="/dashboard/academic-registrar"
            element={<AcademicRegistrar />}
          />
          <Route path="/studentcomplaints" element={<StudentComplaints />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
