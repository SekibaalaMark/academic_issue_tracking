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
import Login from "@/pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import RegisterForm from "@/pages/RegisterForm.jsx";
import StudentDashboard from "@/ui/StudentDashboard/StudentDashboard.jsx";
import Lecturers from "@/ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "@/pages/AcademicRegistrar";
import ForgotPassword from "@/features/authentication/ForgotPassword.jsx";
import StudentComplaints from "@/ui/StudentComplaints/StudentComplaints.jsx";

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (user === null) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      {location.pathname !== "/login" && location.pathname !== "/" && (
        <Navbar />
      )}
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

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
