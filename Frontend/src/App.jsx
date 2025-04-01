import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Students from './pages/Students';
import Lecturer from './pages/Lecturer';
import AcademicRegistrar from './pages/AcademicRegistrar';
import Dashboard from './pages/Dashboard';
import IssueSubmissionForm from './pages/IssueSubmissionForm';
import IssueDetails from './pages/IssueDetails';
import Home from './pages/Home';
import Register from './pages/Register';
import UpdateProfile from './pages/UpdateProfile';
import IssuesTable from './pages/IssuesTable';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* Home route accessible via / */}
      <Route path="/home" element={<Home />} />  {/* Home route also accessible via /home */}
      <Route path="/login" element={<Login />} />
      <Route path="/students" element={<Students />} />
      <Route path="/lecturer" element={<Lecturer />} />
      <Route path="/academicregistrar" element={<AcademicRegistrar />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
      <Route path="/issuedetails" element={<IssueDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/updateprofile" element={<UpdateProfile />} />
      <Route path="/issuestable" element={<IssuesTable />} />
    </Routes>
  );
}

export default App;
