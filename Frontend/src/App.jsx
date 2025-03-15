import "./App.css";
import "./ui/StudentDashboard/StudentDashboard.css";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
import FileAttachment from "./ui/StudentComplaints/FileAttachment.jsx";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./ui/Login/Login.jsx";
import Students from "./ui/Students/Students.jsx";
import Lecturers from "./ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "./pages/AcademicRegistrar";
import StudentFileUpload from "./ui/StudentFileUpload/StudentFileUpload.jsx";
import { AuthProvider } from "../authContext"; // Updated import path
import PrivateRoute from "./components/PrivateRoute";

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
              <li className="nav-item">
                <Link to="/students" className="nav-link">
                  Students
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
              <li className="nav-item">
                <Link to="/student-complaints" className="nav-link">
                  Student Complaints
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/file-attachment" className="nav-link">
                  File Attachment
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/student-file-upload" className="nav-link">
                  Student File Upload
                </Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <AcademicRegistrar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Login />} /> {/* Default route */}
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <StudentDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <PrivateRoute>
                    <Students />
                  </PrivateRoute>
                }
              />
              <Route
                path="/lecturers"
                element={
                  <PrivateRoute>
                    <Lecturers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/academic-registrar"
                element={
                  <PrivateRoute>
                    <AcademicRegistrar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student-complaints"
                element={
                  <PrivateRoute>
                    <StudentComplaints />
                  </PrivateRoute>
                }
              />
              <Route
                path="/file-attachment"
                element={
                  <PrivateRoute>
                    <FileAttachment />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student-file-upload"
                element={
                  <PrivateRoute>
                    <StudentFileUpload />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
