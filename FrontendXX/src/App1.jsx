import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from './StudentPages/Login'; // Make sure this path is correct
import Register from './StudentPages/Register'; // Make sure this path is correct
import Students from './pages/Students';
import Lecturer from './pages/Lecturer';
import AcademicRegistrar from './pages/AcademicRegistrar';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/authContext';
import CoverPage from './StudentPages/CoverPage';

function AppContent() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Default route - redirect to cover page */}
        <Route path="/" element={<Navigate to="/coverpage" replace />} />
        
        {/* Cover page route */}
        <Route path="/cover" element={<CoverPage />} />
        
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/students" element={<Students />} />
        <Route path="/lecturer" element={<Lecturer />} />
        <Route path="/academicregistrar" element={<AcademicRegistrar />} />
        
        {/* Fallback route - redirect to cover page */}
        <Route path="*" element={<Navigate to="/coverpage" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
