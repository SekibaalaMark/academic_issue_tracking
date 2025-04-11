import React from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";

import CoverPage from "./StudentPages/CoverPage.jsx";

import Login from "./StudentPages/Login.jsx";
import RegisterForm from "./StudentPages/RegisterForm.jsx";

import ForgotPassword from "./features/authentication/ForgotPassword.jsx";

import  Logout from "./components/Logout"; // Import  Logout from "./StudentComponents/Logout";
import { Container } from "@mui/material";
import Students from "./pages/Students.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar.jsx";
// import LecturerDashboard from "./pages/LecturerDashboard.jsx"; // Added LecturerDashboard

const ProtectedLayout = () => {
  const { user } = useAuth();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  // Redirect based on role if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If already authenticated, redirect to respective dashboard
  if (isAuthenticated) {
    switch (userRole) {
      case "student":
        return <Navigate to="/student-dashboard" replace />;
      case "lecturer":
        return <Navigate to="/lecturers" replace />;
      case "academicregistrar":
        return <Navigate to="/AcademicRegistrar" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

const AppContent = () => {
  const location = useLocation();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, padding: 3, borderRadius: 2, boxShadow: 3 }}
    >
      <Routes>
        <Route path="" element={<CoverPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/CoverPage" element={<CoverPage />} />
        <Route path="/Students" element={<Students />} />
        <Route path="/AcademicRegistrar" element={<AcademicRegistrar />} />

        {/* <Route path="/AcademicRegistrar" element={<AcademicRegistrar />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/* <Route path="/lecturers" element={<LecturerDashboard />} /> */}
          
        </Route>
      </Routes>
    </Container>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
