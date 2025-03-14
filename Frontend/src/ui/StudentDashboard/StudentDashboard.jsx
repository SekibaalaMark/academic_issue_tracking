import React, { useState, useEffect } from "react";
import FormField from "./FormField/FormField.jsx";
import "../StudentDashboard/StudentDashboard.css";

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

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fields = [
      fullName,
      registrationNumber,
      school,
      department,
      year,
      courseUnit,
      semester,
    ];
    const filledFields = fields.filter((field) => field !== "").length;
    setProgress((filledFields / fields.length) * 100);
  }, [
    fullName,
    registrationNumber,
    school,
    department,
    year,
    courseUnit,
    semester,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted successfully!");
  };

  return (
    <div className="student-dashboard-container">
      <h2>Student Dashboard</h2>
      <div className="dashboard">
        <h1 className="dashboard-heading">Student Dashboard</h1>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="form-container">
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
    </div>
  );
};

export default StudentDashboard;
