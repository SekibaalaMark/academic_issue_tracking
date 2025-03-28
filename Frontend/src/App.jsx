import React from "react";
import "./App.css"; // Import global styles
import { Route, Routes, Navigate, Outlet } from "react-router-dom";

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
import ReactDOM from "react-dom";
import graduationImage from "@/assets/graduationImage/graduation1.png";

import { BrowserRouter } from "react-router-dom";





const ProtectedLayout = () => {
  const { user } = useAuth();

  // if (user === null) {
  //   return <div>Loading...</div>;
  // }

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* <Route path="/dashboard" element={<Dashboard />} />{" "} */}
        {/* Add Dashboard route */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/lecturer" element={<Lecturers />} />
        <Route
          path="/dashboard/academic-registrar"
          element={<AcademicRegistrar />}
        />

        <Route path="/studentcomplaints" element={<StudentComplaints />} />

        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
