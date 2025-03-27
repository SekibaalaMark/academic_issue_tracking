import React from "react";
import "./App.css"; // Import global styles
import { Route, Routes, Navigate, Outlet } from "react-router-dom";

import AcademicRegistrar from "@/pages/AcademicRegistrar"; // Academic Registrar Dashboard
import { AuthProvider, useAuth } from "@/context/authContext"; // Auth Context
import ForgotPassword from "@/features/authentication/ForgotPassword.jsx"; // Forgot Password Page
import Lecturers from "@/ui/Lecturers/Lecturers.jsx"; // Lecturer Dashboard
import Login from "@/pages/Login.jsx"; // Login Page
import RegisterForm from "@/pages/RegisterForm.jsx"; // Registration Page
import StudentDashboard from "@/ui/StudentDashboard/StudentDashboard.jsx"; // Student Dashboard
import StudentComplaints from "@/ui/StudentComplaints"; // Student Complaints Page
import Navbar from "./components/Navbar"; // Navbar Component
import Home from "@/pages/Home"; // Home Page
import Dashboard from "@/pages/Dashboard"; // Import Dashboard component

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

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />{" "}
          {/* Add Dashboard route */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/lecturer" element={<Lecturers />} />
          <Route
            path="/dashboard/academic-registrar"
            element={<AcademicRegistrar />}
          />
          <Route path="/student-complaints" element={<StudentComplaints />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
