import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Students from './pages/Students';
import Lecturer from './pages/Lecturer';
import AcademicRegistrar from './pages/AcademicRegistrar';
import Dashboard from './pages/Dashboard';
import IssueSubmissionForm from './pages/IssueSubmissionForm';
import IssueDetails from './pages/IssueDetails';
import Home from './pages/Home';
import Register from './pages/Register';
import UpdateProfile from './pages/UpdateProfile';
import IssuesTable from './components/IssuesTable';
import LoginForm from './components/LoginForm/LoginForm';
import LecturerIssues from './pages/LecturerIssues';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
// import IssuesTable from './components/IssuesTable';
function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/students" element={<Students />} />
        <Route path="/lecturer" element={<Lecturer />} />
        <Route path="/academicregistrar" element={<AcademicRegistrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issuesubmissionform" element={<IssueSubmissionForm />} />
        <Route path="/issue/:Id" element={<IssueDetails />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/form" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lecturerissues" element={<LecturerIssues />} />
        {/* Add more routes as needed */}
        <Route path="/issues" element={<IssuesTable />} />
      </Routes>
    // </Router>
  );
}

export default App;
