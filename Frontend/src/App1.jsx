import React from "react";
import { Route, Routes, Navigate, Outlet, useLocation,useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";
import ErrorBoundary from "./components/ErrorBoundary";


import CoverPage from "./StudentPages/CoverPage.jsx";

import Login from "./StudentPages/Login.jsx";
import RegisterForm from "./StudentPages/RegisterForm.jsx";

import ForgotPassword from "./features/authentication/ForgotPassword.jsx";

import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard.jsx";// Import  Logout from "./StudentComponents/Logout";

import { Container } from "@mui/material";        
import Students from "./pages/Students.jsx";
import Lecturers from "./pages/Lecturers.jsx";
import "./App.css"; 
 




import AcademicRegistrar from "./pages/AcademicRegistrar.jsx";
// import LecturerDashboard from "./pages/LecturerDashboard.jsx"; // Added LecturerDashboard

const ProtectedLayout = () => {
  // const { user } = useAuth();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  // Redirect based on role if authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

 // If already authenticated, redirect to respective dashboard
  if (isAuthenticated) {
    switch (userRole) {
      case "student":
        return <Navigate to="/Students" replace />;
      case "lecturer":
        return <Navigate to="/lecturers" replace />;
      case "academicregistrar":
        return <Navigate to="/AcademicRegistrar" replace />;
      default:
        return <Navigate to="/coverpage" replace />;
    }
  }
  // if (user) {
  // const userRole = response.data.user.user_role;
  // Redirect based on user role
  // if (userRole === "student") {
  //   return <Navigate to="/Students" replace />;
  // } else if (userRole === "lecturer") {
  //   return <Navigate to="/lecturers" replace />;
  // } else if (userRole === "registrar") {
  //   return <Navigate to="/AcademicRegistrar" replace />;
  // } else {
  //   // Fallback redirect if role is not recognized
  //   return <Navigate to="/" replace />;
  // }

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
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/CoverPage" element={<CoverPage />} /> */}
        <Route path="/students" element={<Students />} />
        <Route path="/AcademicRegistrar" element={<AcademicRegistrar />} />
        <Route path="/registrar" element={<AcademicRegistrar />} />
        <Route path="/lecturers" element={<Lecturers />} />

        {/* <Route path="/AcademicRegistrar" element={<AcademicRegistrar />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          
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
