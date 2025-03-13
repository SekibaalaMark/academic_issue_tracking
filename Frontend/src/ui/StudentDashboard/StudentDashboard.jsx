import React, { useState, useEffect } from "react";
import FormField from "./FormField/FormField.jsx"; // Import the reusable form field component
import "../StudentDashboard/StudentDashboard.css"; // New CSS file for styling

const StudentDashboard = () => {
  const [fullName, setFullName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [courseUnit, setCourseUnit] = useState("");
  const [semester, setSemester] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    console.log({
      fullName,
      registrationNumber,
      school,
      department,
      year,
      courseUnit,
      semester,
      category,
      details,
    });
  }, [
    fullName,
    registrationNumber,
    school,
    department,
    year,
    courseUnit,
    semester,
    category,
    details,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted successfully!");
  };

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      <div className="form-container">
        <h2>Student Complaint Form</h2>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full names"
            required
          />
          <FormField
            label="Registration/Student Number"
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Enter registration/student number"
            required
          />
          <FormField
            label="School/College"
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Enter your school/college"
            required
          />
          <FormField
            label="Department of Study"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter department of study"
            required
          />
          <FormField
            label="Year of Sitting"
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year of sitting"
            required
          />
          <FormField
            label="Course Unit"
            type="text"
            value={courseUnit}
            onChange={(e) => setCourseUnit(e.target.value)}
            placeholder="Enter course unit"
            required
          />
          <FormField
            label="Semester"
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter your semester"
            required
          />

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
      <div className="footer">
        <p>&copy; 2025 Makerere University (AITS) All rights reserved</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
