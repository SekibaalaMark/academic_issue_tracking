import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/authContext";

import CoverPage from "./StudentPages/CoverPage.jsx";
import Login from "./StudentPages/Login.jsx";
import RegisterForm from "./StudentPages/RegisterForm.jsx";
import ForgotPassword from "./features/authentication/ForgotPassword.jsx";
import Logout from "./components/Logout";
import { Container } from "@mui/material";
import Students from "./pages/Students.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar.jsx";
// import LecturerDashboard from "./pages/LecturerDashboard.jsx";

const ProtectedLayout = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppContent = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, padding: 3, borderRadius: 2, boxShadow: 3 }}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<CoverPage />} />
        <Route path="/CoverPage" element={<CoverPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/Students" element={<Students />} />
          <Route path="/AcademicRegistrar" element={<AcademicRegistrar />} />
          {/* <Route path="/lecturers" element={<LecturerDashboard />} /> */}
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
