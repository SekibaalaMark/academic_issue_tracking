import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import Students from "./ui/Students/Students.jsx";
import Lecturers from "./ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
import Login from "./ui/Login/Login.jsx"; // Updated path for Login
import { AuthProvider, useAuth } from "./context/authContext.jsx"; // Correct extension

function App() {
  const { authState } = useAuth(); // Access authentication state

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {authState ? ( // Conditionally render navigation if authenticated
            <>
              <nav className="navbar">
                <div className="nav-container">
                  <ul className="nav-list">
                    <li className="nav-item">
                      <Link to="/dashboard" className="nav-link">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/students" className="nav-link">
                        Students
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/student-complaints" className="nav-link">
                        Student Complaints
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/lecturers" className="nav-link">
                        Lecturers
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/academic-registrar" className="nav-link">
                        Academic Registrar
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
              <div className="content">
                <Routes>
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
                </Routes>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="*" element={<Login />} /> {/* Default to Login */}
            </Routes>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
