import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import AcademicRegistrar from './pages/AcademicRegistrar';
import Dashboard from './pages/Dashboard';
import IssueSubmissionForm from './pages/IssueSubmissionForm';
import IssueDetails from './pages/IssueDetails';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lecturers" element={<Lecturers />} />
        <Route path="/academicregistrar" element={<AcademicRegistrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
        <Route path="/issuedetails" element={<IssueDetails />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
