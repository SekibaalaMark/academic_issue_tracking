import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !role ||
      !studentNumber
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Store user data in localStorage (You may want to handle this differently in a real app)
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("studentNumber", studentNumber);

    alert("Registration successful! Redirecting to complaints form...");
    navigate("/student-complaints"); // Redirect to StudentComplaints form
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Register
      </Typography>
      <TextField
        fullWidth
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
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
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Student Number"
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
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
