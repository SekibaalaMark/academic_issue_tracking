import React from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";

import CoverPage from "./StudentPages/CoverPage.jsx";
import RoleSelectionPage from "./StudentPages/RoleSelectionPage";
import Login from "./StudentPages/Login.jsx";
import RegisterForm from "./StudentPages/RegisterForm.jsx";

// import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";

import ForgotPassword from "./features/authentication/ForgotPassword.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
// Import EmailForm
import Logout from "./StudentComponents/Logout"; // Corrected the import path
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
      <Routes>
        <Route path="" element={<CoverPage />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/student-complaints" element={<StudentComplaints />} />
        <Route path="/logout" element={<Logout />} /> {/* Added logout route */}
        <Route path="/CoverPage" element={<CoverPage />} />{" "}
        <Route path="/dashboard" element={<ProtectedLayout />}></Route>
      </Routes>
    </Container>
  );
};

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />  {/* Home route accessible via / */}
//       <Route path="/home" element={<Home />} />  {/* Home route also accessible via /home */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/students" element={<Students />} />
//       <Route path="/lecturer" element={<Lecturer />} />
//       <Route path="/academicregistrar" element={<AcademicRegistrar />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
//       <Route path="/issuedetails" element={<IssueDetails />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/updateprofile" element={<UpdateProfile />} />
//       <Route path="/issuestable" element={<IssuesTable />} />
//     </Routes>

//   );
// };

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
