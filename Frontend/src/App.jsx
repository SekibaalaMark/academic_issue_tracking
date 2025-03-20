import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import AcademicRegistrar from "./ui/AcademicRegistrar.jsx"; // Updated path
import { AuthProvider, useAuth } from "../contexts/authContext";
import ForgotPassword from "./features/authentication/ForgotPassword.jsx"; // Updated path
import Lecturers from "./ui/Lecturers/Lecturers.jsx"; // Updated path
import Login from "./pages/Login.jsx"; // Updated path
import RegisterForm from "./pages/RegisterForm.jsx"; // Added path for RegisterForm
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "./ui/StudentComplaints";
// Protected route layout component
const ProtectedLayout = () => {
  const { authState } = useAuth();

  if (authState === null) {
    return <div>Loading...</div>;
  }

  if (!authState) {
    return <Navigate to="/login" replace />; // Updated path
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Updated path */}
          <Route path="/register" element={<RegisterForm />} />{" "}
          {/* Added path for RegisterForm */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />{" "}
          {/* Updated path */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/lecturers" element={<Lecturers />} />
            <Route path="/academic-registrar" element={<AcademicRegistrar />} />
            <Route path="/student-complaints" element={<StudentComplaints />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />{" "}
          {/* Updated path */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
