import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://127.0.0.1:8000/admin", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);

        // Navigate based on role
        switch (response.data.role) {
          case "student":
            navigate("/students");
            break;
          case "lecturer":
            navigate("/lecturers");
            break;
          case "registrar":
            navigate("/academic-registrar");
            break;
          default:
            navigate("/dashboard"); // Default fallback
        }
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <h2 className="site-title">FAMS</h2>

      <div className="login-container">
        <div className="login-header">Login</div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-Mail Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="login-links">
            <a href="#">Forgot Your Password?</a>
            <a href="#">Trouble Login?</a>
          </div>
        </div>
      </div>

      <div className="auth-links">
        <a href="#">Login</a> | <a href="#">Register</a>
      </div>
    </div>
  );
};

export default Login;
