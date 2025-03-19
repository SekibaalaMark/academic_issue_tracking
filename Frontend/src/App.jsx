import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import StudentDashboard from ".src/ui/StudentDashboard";

import Lecturers from "./ui/Lecturers";
import AcademicRegistrar from "./pages/AcademicRegistrar";
import StudentComplaints from "./ui/StudentComplaints";
import Login from "./ui/Login";
import { AuthProvider, useAuth } from "./context/authContext";
import SignIn from "./features/authentication/SignIn";
import ForgotPassword from "./features/authentication/ForgotPassword";
import MyComponent from "../components/MyComponent.jsx";

// Create a protected route layout component
const ProtectedLayout = () => {
  const { authState } = useAuth();

  if (authState === null) {
    return <div>Loading...</div>; // Fallback UI while checking authentication
  }

  // Redirect to signin if not authenticated
  if (!authState) {
    return <Navigate to="/signin" replace />;
  }

  // Render the children routes if authenticated
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <MyComponent />
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Redirect root path to sign-in page */}
            <Route path="/" element={<Navigate to="/signin" replace />} />

            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              
              <Route path="/lecturers" element={<Lecturers />} />
              <Route
                path="/academic-registrar"
                element={<AcademicRegistrar />}
              />
              <Route
                path="/student-complaints"
                element={<StudentComplaints />}
              />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
