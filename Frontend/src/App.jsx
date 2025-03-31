import React from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";
import Navbar from "./components/Navbar";
import CoverPage from "./pages/CoverPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import Login from "./pages/Login.jsx";
import RegisterForm from "./pages/RegisterForm.jsx";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import Lecturers from "./ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "@/pages/AcademicRegistrar";
import ForgotPassword from "./features/authentication/ForgotPassword.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
import EmailForm from "./components/EmailForm"; // Import EmailForm
import { Container, CircularProgress } from "@mui/material";

const ProtectedLayout = () => {
  const { user } = useAuth();
  const selectedRole = localStorage.getItem("selectedRole");

  if (user === null) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return selectedRole ? (
      <Navigate to="/login" replace />
    ) : (
      <Navigate to="/role-selection" replace />
    );
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
      {location.pathname !== "/login" && location.pathname !== "/" && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/student-complaints"
          element={<StudentComplaints />}
        />{" "}
        {/* Added route for StudentComplaints */}
        <Route path="/email" element={<EmailForm />} />{" "}
        {/* Added route for EmailForm */}
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route path="student" element={<StudentDashboard />} />
          <Route path="lecturer" element={<Lecturers />} />
          <Route path="academic-registrar" element={<AcademicRegistrar />} />
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
