import React from "react";
import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext"; // Auth Context
// import NavigationBar from "@/components/NavigationBar"; // Corrected import for NavigationBar
import Navbar from "./components/Navbar";
import CoverPage from "./pages/CoverPage";
import RoleSelectionPage from "./pages/RoleSelectionPage"; // Corrected import for RoleSelectionPage
import Login from "./pages/Login.jsx"; // Corrected import for Login
import RegisterForm from "./pages/RegisterForm.jsx"; // Corrected import for RegisterForm
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx"; // Corrected import for StudentDashboard
import Lecturers from "./ui/Lecturers/Lecturers.jsx"; // Corrected import for Lecturers
import AcademicRegistrar from "@/pages/AcademicRegistrar";
import ForgotPassword from "./features/authentication/ForgotPassword.jsx"; // Corrected import for ForgotPassword
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx"; // Corrected import for StudentComplaints
// import SubmitIssue from "./pages/SubmitIssue";
// import IssueStatus from "./pages/IssueStatus";
// import Verify from "./pages/Verify";
import { Container } from "@mui/material"; // Material-UI for automatic styling

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
        <NavigationBar />
      )}
      <Navbar />
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
          <Route path="/submit-issue" element={<SubmitIssue />} />
          <Route path="/issue-status" element={<IssueStatus />} />
          <Route path="/verify" element={<Verify />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Container>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
