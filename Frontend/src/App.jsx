import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";
import Navbar from "./components/Navbar";
import CoverPage from "./pages/CoverPage";
import RoleSelectionPage from "@/pages/RoleSelectionPage";
import Login from "@/pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterForm from "@/pages/RegisterForm";
import StudentDashboard from "@/ui/StudentDashboard/StudentDashboard";
import Lecturers from "@/ui/Lecturers/Lecturers";
import AcademicRegistrar from "@/pages/AcademicRegistrar";
import ForgotPassword from "@/features/authentication/ForgotPassword";
import StudentComplaints from "@/ui/StudentComplaints/StudentComplaints";

// ProtectedLayout ensures only authenticated users can access certain routes
const ProtectedLayout = () => {
  const { user } = useAuth();

  if (user === null) return <div>Loading...</div>; // Show loading state while checking authentication
  if (!user) return <Navigate to="/login" replace />; // Redirect unauthenticated users to login
  return <Outlet />; // Render child routes for authenticated users
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      {/* Conditionally render Navbar for all routes except login and cover page */}
      {location.pathname !== "/login" && location.pathname !== "/" && (
        <Navbar />
      )}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<CoverPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/lecturer" element={<Lecturers />} />
          <Route
            path="/dashboard/academic-registrar"
            element={<AcademicRegistrar />}
          />
          <Route path="/studentcomplaints" element={<StudentComplaints />} />
        </Route>

        {/* Catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// Wrap App in Router to enable routing
const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
