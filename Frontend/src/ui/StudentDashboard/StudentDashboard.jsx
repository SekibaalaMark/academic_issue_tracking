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
  const [dateRaised, setDateRaised] = useState("");
  const [status, setStatus] = useState("");
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
      dateRaised,
      status,
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
    dateRaised,
    status,
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
          <FormField label="Category of Complaint" type="select" value={category} onChange={(e) => setCategory(e.target.value)} options={["Academic", "Administrative", "Facility", "Other"]} required />
          {/* <FormField label="Status" type="select" value={status} onChange={(e) => setStatus(e.target.value)} options={["Pending", "Resolved", "In Progress"]} required /> */}
          <div className="form-field">
            <label>Complaint Details</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Provide detailed description of your complaint" required></textarea>
          </div>
          <button type="submit" className="submit-btn">Submit Complaint</button>
        </form>
      </div>
      <div className="footer">
        <p>&copy; 2025 Makerere University (AITS) All rights reserved</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
