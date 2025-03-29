import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";

const Login = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [role, setRole] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = () => {
      const selectedRole = localStorage.getItem("selectedRole");
      console.log(`Retrieved role from local storage: ${selectedRole}`); // Debugging line
      if (selectedRole) {
        setRole(selectedRole);
      } else {
        setError("No role selected. Please go back and select a role.");
        navigate("/role-selection");
      }
      setLoading(false); // Ensure loading is set to false after role check
    };

    fetchRole();
  }, [navigate]);

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <CircularProgress />
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Loading, please wait...
        </Typography>
      </Container>
    ); // Display spinner while loading
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const { username, password } = credentials;

    console.log(`Attempting login with username: ${username}, role: ${role}`); // Debugging line

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
      console.log(`Login successful. Navigating to: ${roleRoutes[role]}`); // Debugging line
      navigate(roleRoutes[role]);
    } else {
      console.error("Invalid credentials or role mismatch."); // Debugging line
      setError("Invalid credentials or role mismatch.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {role ? (
        <Typography variant="h6" align="center" gutterBottom>
          Role: {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>
      ) : (
        <Alert severity="error" style={{ marginBottom: "16px" }}>
          Unable to determine role. Please go back and select a role.
        </Alert>
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
