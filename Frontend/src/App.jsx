import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import AcademicRegistrars from './pages/AcademicRegistrars';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lecturers" element={<Lecturers />} />
        <Route path="/academicregistrars" element={<AcademicRegistrars />} />
      </Routes>
    </Router>
  );
}

export default App;
