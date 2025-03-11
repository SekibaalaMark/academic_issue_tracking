import "./App.css";
import { Link } from "react-router-dom";

import "./ui/StudentDashboard/StudentDashboard.css";



import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";







function App() {
  return(
    <>
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
        </ul>
      </nav>
    </>
  );
}

export default App;
