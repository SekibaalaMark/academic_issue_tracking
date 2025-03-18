import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import Students from "./ui/Students/Students.jsx";
import Lecturers from "./ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
import StudentFileUpload from "./ui/StudentFileUpload/StudentFileUpload.jsx"; // Import StudentFileUpload
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              {/* Grouping student-related links */}
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
                <Link to="/student-file-upload" className="nav-link">
                  File Upload
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
          </nav>
          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Login />} /> {/* Default route */}
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
              <Route
                path="/student-file-upload"
                element={<StudentFileUpload />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
