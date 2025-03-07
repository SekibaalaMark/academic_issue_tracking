import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
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
