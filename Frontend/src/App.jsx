import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard.jsx"; // Updated path
import AcademicRegistrar from "./pages/AcademicRegistrar/AcademicRegistrar.jsx"; // Updated path
import StudentComplaints from "./pages/StudentComplaints/StudentComplaints.jsx"; // Updated path
import { AuthProvider, useAuth } from "./context/authContext";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx"; // Updated path
import Lecturers from "./pages/Lecturers/Lecturers.jsx"; // Updated path
import Login from "./pages/Login/Login.jsx"; // Updated path
import RegisterForm from "./pages/RegisterForm.jsx"; // Added path for RegisterForm

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
