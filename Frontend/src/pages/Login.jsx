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
import axios from "axios"; // Added axios import

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [email, setEmail] = useState(""); // Added email state
  const [password, setPassword] = useState(""); // Added password state
  const [message, setMessage] = useState(""); // Added message state
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

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
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
          label="Email"
          name="email"
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
        {message && (
          <Typography
            variant="body1"
            align="center"
            style={{ marginTop: "16px" }}
          >
            {message}
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default Login;
