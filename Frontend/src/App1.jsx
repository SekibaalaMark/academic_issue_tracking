import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/authContext";
import ErrorBoundary from "./components/ErrorBoundary";
import CoverPage from "./StudentPages/CoverPage.jsx";
import Login from "./StudentPages/Login.jsx";
import RegisterForm from "./StudentPages/RegisterForm.jsx";
import ForgotPassword from "./features/authentication/ForgotPassword.jsx";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard.jsx";
import { Container } from "@mui/material";
import Students from "./pages/Students.jsx";
import Lecturers from "./pages/Lecturers.jsx";
import "./App.css";
import AcademicRegistrar from "./pages/AcademicRegistrar.jsx";

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user.role.toLowerCase()) {
    case "student":
      return <Navigate to="/Students" replace />;
    case "lecturer":
      return <Navigate to="/lecturers" replace />;
    case "academic_registrar":
      return <Navigate to="/AcademicRegistrar" replace />;
    default:
      return <Navigate to="/CoverPage" replace />;
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
        <Route path="/" element={<CoverPage />} />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundary>
              <RegisterForm />
            </ErrorBoundary>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ErrorBoundary>
              <ForgotPassword />
            </ErrorBoundary>
          }
        />
        <Route
          path="/logout"
          element={
            <ErrorBoundary>
              <Logout />
            </ErrorBoundary>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          }
        />
        <Route
          path="/CoverPage"
          element={
            <ErrorBoundary>
              <CoverPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/students"
          element={
            <ErrorBoundary>
              <Students />
            </ErrorBoundary>
          }
        />
        <Route
          path="/lecturers"
          element={
            <ErrorBoundary>
              <Lecturers />
            </ErrorBoundary>
          }
        />
        <Route
          path="/AcademicRegistrar"
          element={
            <ErrorBoundary>
              <AcademicRegistrar />
            </ErrorBoundary>
          }
        />
        <Route
          path="/registrar"
          element={
            <ErrorBoundary>
              <AcademicRegistrar />
            </ErrorBoundary>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/Students" element={<Students />} />
          <Route path="/Lecturers" element={<Lecturers />} />
          <Route path="/AcademicRegistrar" element={<AcademicRegistrar />} />
        </Route>
      </Routes>
    </Container>
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
