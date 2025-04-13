import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";
import ErrorBoundary from "./components/ErrorBoundary";
import CoverPage from "./StudentPages/CoverPage.jsx";
import Login from "./StudentPages/Login.jsx";
import RegisterForm from "./StudentPages/RegisterForm.jsx";
import ForgotPassword from "./features/authentication/ForgotPassword.jsx";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Lecturers from "./pages/Lecturers.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar.jsx";
import { Container } from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";

// Protected route component that checks authentication
const ProtectedRoute = ({ allowedRoles, redirectPath = "/login", children }) => {
  // Get authentication state from localStorage directly to avoid dependency on context
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState(redirectPath);

  // Determine if redirection is needed - only run this once on mount
  useEffect(() => {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      setShouldRedirect(true);
      setRedirectTo(redirectPath);
      return;
    }
    
    // If roles are specified, check if user has permission
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Determine appropriate dashboard based on role
      let targetPath;
      switch (userRole) {
        case "student":
          targetPath = "/students";
          break;
        case "lecturer":
          targetPath = "/lecturers";
          break;
        case "registrar":
        case "academicregistrar":
          targetPath = "/academicregistrar";
          break;
        default:
          targetPath = "/dashboard";
      }
      
      setShouldRedirect(true);
      setRedirectTo(targetPath);
    } else {
      // User is authenticated and has permission
      setShouldRedirect(false);
    }
  }, []); // Empty dependency array - only run once on mount

  // Perform the redirect if needed
  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }

  // If we get here, the user is authenticated and has permission
  return children ? children : <Outlet />;
};

// Redirect authenticated users to their dashboard
const RedirectIfAuthenticated = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  // Determine if redirection is needed - only run this once on mount
  useEffect(() => {
    if (isAuthenticated) {
      // Determine appropriate dashboard based on role
      let targetPath;
      switch (userRole) {
        case "student":
          targetPath = "/students";
          break;
        case "lecturer":
          targetPath = "/lecturers";
          break;
        case "registrar":
        case "academicregistrar":
          targetPath = "/academicregistrar";
          break;
        default:
          targetPath = "/dashboard";
      }
      
      setShouldRedirect(true);
      setRedirectTo(targetPath);
    } else {
      // User is not authenticated
      setShouldRedirect(false);
    }
  }, []); // Empty dependency array - only run once on mount

  // Perform the redirect if needed
  if (shouldRedirect) {
    return <Navigate to={redirectTo} replace />;
  }

  // If we get here, the user is not authenticated
  return children;
};

// Main content component with routes
const AppContent = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, padding: 3, borderRadius: 2, boxShadow: 3 }}
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<CoverPage />} />
        
        {/* Authentication routes - redirect if already logged in */}
        <Route element={<RedirectIfAuthenticated><Outlet /></RedirectIfAuthenticated>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/coverpage" element={<CoverPage />} />
        </Route>
        
        {/* Routes that require authentication */}
        <Route path="/logout" element={<Logout />} />
        
        {/* Dashboard routes with role-based access */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/students" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Students />
          </ProtectedRoute>
        } />
        
        <Route path="/lecturers" element={
          <ProtectedRoute allowedRoles={["lecturer"]}>
            <Lecturers />
          </ProtectedRoute>
        } />
        
        <Route path="/academicregistrar" element={
          <ProtectedRoute allowedRoles={["registrar", "academicregistrar"]}>
            <AcademicRegistrar />
          </ProtectedRoute>
        } />
        
        {/* Redirect for legacy URLs */}
        <Route path="/registrar" element={<Navigate to="/academicregistrar" replace />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Container>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
