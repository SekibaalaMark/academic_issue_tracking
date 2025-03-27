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
import Register from './pages/Register';
import UpdateProfile from './pages/UpdateProfile';
import IssuesTable from './components/IssuesTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/students" element={<Students />} />
        <Route path="/lecturerdashboard" element={<LecturersDashboard />} />
        <Route path="/academicregistrar" element={<AcademicRegistrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
        <Route path="/issuedetails" element={<IssueDetails />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
