import { useEffect, useState } from "react";
import { fetchData } from "./Services/api";  // ✅ Import API function
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(setData).catch(console.error);
  }, []);

  return (
    <>
      {/* Vite and React logos */}
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      {/* Main heading */}

      {/* Counter section */}
      <div className="card">
        <h2>Data from Django API</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/lecturers">Lecturers</Link></li>
          <li><Link to="/academic-registrar">Academic Registrar</Link></li>
        </ul>
      </nav>

      <p className="read-the-docs">
        Click on the links above to navigate.
      </p>
    </>
  );
}

export default App;
