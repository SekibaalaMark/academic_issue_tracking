import "./App.css";
import "./ui/StudentDashboard/StudentDashboard.css";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx"; // Import StudentComplaints
import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <div>
        <StudentDashboard />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/students">Students</Link>
          </li>
          <li>
            <Link to="/lecturers">Lecturers</Link>
          </li>
          <li>
            <Link to="/academic-registrar">Academic Registrar</Link>
          </li>
          <li>
            <Link to="/student-complaints">Student Complaints</Link>{" "}
            {/* Add link to Student Complaints */}
          </li>
        </ul>
      </nav>
      {/* <StudentComplaints /> */}
    </div>
  );
}

export default App;
