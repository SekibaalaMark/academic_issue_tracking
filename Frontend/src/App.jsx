import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import AcademicRegistrar from "@/pages/AcademicRegistrar";
import { AuthProvider, useAuth } from "@/context/authContext";
import ForgotPassword from "@/features/authentication/ForgotPassword.jsx";
import Lecturers from "@/ui/Lecturers/Lecturers.jsx";
import Login from "@/pages/Login.jsx";
import RegisterForm from "@/pages/RegisterForm.jsx";
import StudentDashboard from "@/ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "@/ui/StudentComplaints";

const ProtectedLayout = () => {
  const { authState } = useAuth();

  if (authState === null) {
    return <div>Loading...</div>;
  }

  if (!authState) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/lecturers" element={<Lecturers />} />
            <Route path="/academic-registrar" element={<AcademicRegistrar />} />
            <Route path="/student-complaints" element={<StudentComplaints />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
