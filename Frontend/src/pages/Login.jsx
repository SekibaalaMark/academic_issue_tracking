import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Alert } from "@mui/material";

const Login = () => {
  const [role, setRole] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedRole = localStorage.getItem("selectedRole");
    if (selectedRole) {
      setRole(selectedRole);
    } else {
      setError("No role selected. Please go back and select a role.");
      // Navigate back to the role selection page
      navigate("/role-selection");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const { username, password } = credentials;

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    const roleRoutes = {
      student: "/dashboard/student",
      lecturer: "/dashboard/lecturer",
      "academic-registrar": "/dashboard/academic-registrar",
    };

    if (username === role && password === "password" && roleRoutes[role]) {
      navigate(roleRoutes[role]);
    } else {
      setError("Invalid credentials or role mismatch.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {role && (
        <Typography variant="h6" align="center" gutterBottom>
          Role: {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>
      )}
      {error && (
        <Alert severity="error" style={{ marginBottom: "16px" }}>
          {error}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Username"
        name="username"
        margin="normal"
        variant="outlined"
        value={credentials.username}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        margin="normal"
        variant="outlined"
        value={credentials.password}
        onChange={handleInputChange}
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
