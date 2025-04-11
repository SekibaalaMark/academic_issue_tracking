// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      window.location.href = '/login'; // Redirect to login if not authenticated
    }
  }, []);

  if (!isLoggedIn) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the protected dashboard!</p>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/lecturers">Lecturers</Link></li>
          <li><Link to="/academic-registrar">Academic Registrar</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
