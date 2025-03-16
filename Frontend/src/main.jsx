// src/main.jsx
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Students from "./ui/Students/Students";
import Lecturers from "./ui/Lecturers/Lecturers"; // Corrected path
import AcademicRegistrar from "./pages/AcademicRegistrar";
import RegisterForm from "./pages/RegisterForm";
import StudentComplaints from "./ui/StudentComplaints/StudentComplaints.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <App />
  </StrictMode>

  // <Router>
  //   <Routes>
  //     <Route path="/" element={<App />} />
  //     <Route path="/login" element={<Login />} />
  //     <Route path="/register" element={<RegisterForm />} />
  //     <Route path="/dashboard" element={<Dashboard />} />
  //     <Route path="/home" element={<Home />} />
  //     <Route path="/students" element={<Students />} />
  //     <Route path="/lecturers" element={<Lecturers />} />
  //     <Route path="/academic-registrar" element={<AcademicRegistrar />} />
  //     <Route path="/student-complaints" element={<StudentComplaints />} />
  //   </Routes>
  // </Router>
);
