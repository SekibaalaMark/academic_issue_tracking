import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");
    const isVerified = localStorage.getItem("isVerified");

    if (email === storedEmail && password === storedPassword) {
      if (isVerified === "true") {
        alert("Login successful!");
      } else {
        alert("Please verify your email before logging in.");
      }
    } else {
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Login
      </Typography>
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
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
};

export default Login;
