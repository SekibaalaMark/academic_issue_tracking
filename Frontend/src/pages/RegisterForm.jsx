import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [courseUnit, setCourseUnit] = useState("");
  const [semester, setSemester] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (
      !fullName ||
      !studentNumber ||
      !school ||
      !department ||
      !year ||
      !courseUnit ||
      !semester ||
      !email ||
      !password
    ) {
      alert("Please fill all fields");
      return;
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store user data in localStorage
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("studentNumber", studentNumber);
    localStorage.setItem("school", school);
    localStorage.setItem("department", department);
    localStorage.setItem("year", year);
    localStorage.setItem("courseUnit", courseUnit);
    localStorage.setItem("semester", semester);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    localStorage.setItem("verificationCode", verificationCode);
    localStorage.setItem("isVerified", "false");

    alert(`Your verification code is: ${verificationCode}`);
    navigate("/student-complaints"); // Redirect to StudentComplaints page
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Register
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Registration/Student Number"
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="School/College"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Department of Study"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Year of Sitting"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Course Unit"
        value={courseUnit}
        onChange={(e) => setCourseUnit(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleRegister}
      >
        Register
      </Button>
    </Container>
  );
};

export default RegisterForm;
