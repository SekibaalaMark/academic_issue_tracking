// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import AcademicRegistrar from './pages/AcademicRegistrar';
import LoginForm from './components/LoginForm/LoginForm';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/form" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/students" element={<Students />} />
      <Route path="/lecturers" element={<Lecturers />} />
      <Route path="/academic-registrar" element={<AcademicRegistrar />} />
    </Routes>
  </Router>
);
