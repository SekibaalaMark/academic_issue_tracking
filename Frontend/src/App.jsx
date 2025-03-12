import "./App.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import "./ui/StudentDashboard/StudentDashboard.css";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx"; // Import StudentComplaints

function App() {
  return (
    <Router>
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
      <Switch>
        {/* Add routes for different components */}
        <Route path="/student-complaints" component={StudentComplaints} />
        {/* Add other routes here */}
      </Switch>
    </Router>
  );
}

export default App;
