import "./App.css";
import "./ui/StudentDashboard/StudentDashboard.css";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx"; // Import StudentComplaints
import { Link } from "react-router-dom";

function App() {
  return (
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
        </ul>
      </nav>
      <div className="content">
        <StudentDashboard />
      </div>
    </div>
  );
}

export default App;
