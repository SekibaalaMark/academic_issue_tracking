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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lecturer" element={<Lecturer />} />
        <Route path="/academicregistrar" element={<AcademicRegistrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
        <Route path="/issue/:Id" element={<IssueDetails />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/form" element={<LoginForm />} />
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
    </Router>
  );
}
export default App;