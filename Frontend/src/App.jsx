import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import Students from "./ui/Students/Students.jsx";
import Lecturers from "./ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
import Login from "./ui/Login/Login.jsx";
import { AuthProvider, useAuth } from "./context/authContext.jsx";
import SignIn from "./features/authentication/SignIn";
import ForgotPassword from "./features/authentication/ForgotPassword";
import MyComponent from "./components/MyComponent.jsx";

function App() {
  const { authState } = useAuth(); // Access authentication state

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <MyComponent />
          <Routes>
            {!authState ? (
              // If not authenticated, show the login page
              <Route path="*" element={<Login />} />
            ) : (
              // If authenticated, show the dashboard and other routes
              <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/lecturers" element={<Lecturers />} />
                <Route
                  path="/academic-registrar"
                  element={<AcademicRegistrar />}
                />
                <Route
                  path="/student-complaints"
                  element={<StudentComplaints />}
                />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
