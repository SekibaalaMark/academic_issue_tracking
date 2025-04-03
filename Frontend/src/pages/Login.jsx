import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      // Single API call to login endpoint
      const response = await axios.post("http://127.0.0.1:8000/admin/", {
        username,
        password,
      });
      console.log(response);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("userId", response.data.userId); // Store user ID if needed

        // Navigate based on role
        switch (response.data.role) {
          case "student":
            navigate("/Students");
            break;
          case "lecturer":
            navigate("/Lecturer");
            break;
          case "AcademicRegistrar":
            navigate("/AcademicRegistrar");
            break;
          default:
            navigate("/home"); // Default case if role is not recognized
        }
      }
    } catch (err) {
      console.log(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <h2 className="site-title">ACADEMIC ISSUE TRACKING</h2>

      <div className="login-container">
        <div className="login-header">Login</div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="login-links">
            <a href="#">Forgot Your Password?</a>
          </div>
        </div>
      </div>

      <div className="auth-links">
        <p>Don't have an account?</p>
        <a href="/register">Register here</a>
      </div>
    </div>
  );
};

export default Login;
