import "./App.css";
import "./ui/StudentDashboard/StudentDashboard.css";
import StudentDashboard from "./ui/StudentDashboard/StudentDashboard.jsx";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";
import FileAttachment from "./ui/StudentComplaints/FileAttachment.jsx";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./ui/Login/Login.jsx";
import Students from "./ui/Students/Students.jsx";
import Lecturers from "./ui/Lecturers/Lecturers.jsx";
import AcademicRegistrar from "./ui/AcademicRegistrar/AcademicRegistrar.jsx";

function App() {
  return (
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
          </ul>
        </nav>
        <div className="content">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={StudentDashboard} />
            <Route path="/students" component={Students} />
            <Route path="/lecturers" component={Lecturers} />
            <Route path="/academic-registrar" component={AcademicRegistrar} />
            <Route path="/student-complaints" component={StudentComplaints} />
            <Route path="/file-attachment" component={FileAttachment} />
            <Route path="/" exact component={Login} /> {/* Default route */}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
