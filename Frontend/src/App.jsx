import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import AcademicRegistrar from './pages/AcademicRegistrar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lecturers" element={<Lecturers />} />
        <Route path="/academicregistrar" element={<AcademicRegistrar />} />
      </Routes>
    </Router>
  );
}

export default App;
