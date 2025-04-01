<<<<<<< HEAD
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
import Logout from "./components/Logout"; // Corrected the import path
import { Container, CircularProgress } from "@mui/material";

const ProtectedLayout = () => {
  const { user } = useAuth();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
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
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/student-complaints" element={<StudentComplaints />} />
        <Route path="/email" element={<EmailForm />} />
        <Route path="/logout" element={<Logout />} /> {/* Added logout route */}
        <Route path="/CoverPage" element={<CoverPage />} />{" "}
        {/* Add route for CoverPage */}
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route path="student" element={<StudentDashboard />} />
          <Route path="lecturer" element={<Lecturers />} />
          <Route path="academic-registrar" element={<AcademicRegistrar />} />
        </Route>
      </Routes>
    </Container>
=======
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Students from './pages/Students';
import Lecturer from './pages/Lecturer';
import AcademicRegistrar from './pages/AcademicRegistrar';
import Dashboard from './pages/Dashboard';
import IssueSubmissionForm from './pages/IssueSubmissionForm';
import IssueDetails from './pages/IssueDetails';
import Home from './pages/Home';
import Register from './pages/Register';
import UpdateProfile from './pages/UpdateProfile';
import IssuesTable from './pages/IssuesTable';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* Home route accessible via / */}
      <Route path="/home" element={<Home />} />  {/* Home route also accessible via /home */}
      <Route path="/login" element={<Login />} />
      <Route path="/students" element={<Students />} />
      <Route path="/lecturer" element={<Lecturer />} />
      <Route path="/academicregistrar" element={<AcademicRegistrar />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
      <Route path="/issuedetails" element={<IssueDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/updateprofile" element={<UpdateProfile />} />
      <Route path="/issuestable" element={<IssuesTable />} />
    </Routes>
>>>>>>> origin/main
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
