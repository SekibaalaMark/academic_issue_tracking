import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    localStorage.setItem("fullName", fullName);

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
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
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
