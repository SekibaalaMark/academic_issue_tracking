import React from "react";
import "./App.css"; // Import global styles
import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom"; // Import useNavigate and useLocation for navigation
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material"; // Import Material-UI components

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
import CoverPage from "./pages/CoverPage"; // Import CoverPage component
import ReactDOM from "react-dom";
// import graduationImage from "@/assets/graduationImage/graduation1.png";

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

function RoleSelectionPage() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    switch (role) {
      case "student":
        navigate("/login?role=student");
        break;
      case "lecturer":
        navigate("/login?role=lecturer");
        break;
      case "academic-registrar":
        navigate("/login?role=academic-registrar");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Academic Issue Tracking System
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Please select your role to proceed
      </Typography>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        style={{ marginTop: "20px" }}
      >
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Student
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRoleSelection("student")}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Lecturer
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRoleSelection("lecturer")}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Academic Registrar
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleRoleSelection("academic-registrar")}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function App() {
  const location = useLocation(); // Get the current route

  return (
    <AuthProvider>
      {location.pathname !== "/login" && <Navbar />}{" "}
      {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />{" "}
        {/* Updated to use RoleSelectionPage */}
        <Route
          path="*"
          element={
            <>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/dashboard/student"
                  element={<StudentDashboard />}
                />
                <Route path="/dashboard/lecturer" element={<Lecturers />} />
                <Route
                  path="/dashboard/academic-registrar"
                  element={<AcademicRegistrar />}
                />
                <Route
                  path="/studentcomplaints"
                  element={<StudentComplaints />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
