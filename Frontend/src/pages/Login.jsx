import React, { useState } from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import styles from "./register.module.css";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa"; // Import icons
import { useAuth } from "../../authContext"; // Import useAuth hook

const StyledForm = styled(Form)`
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Center vertically */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  width: clamp(300px, 80%, 400px);
  margin: 0 auto;
  padding: 2rem;
  @media (max-width: 480px) {
    max-width: 90%;
    padding: 1.5rem;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem; /* Adjust padding for icons */
  font-size: 1rem;
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Both fields are required.");
      return;
    }
    setError("");
    try {
      await login({ username, password });
      alert("Login successful!");
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className={styles.formCenter}>
      <StyledForm onSubmit={handleSubmit}>
        <h2>welcome to AITS</h2>
        <h2>Login</h2>
        <FormRow label="username">
          <div style={{ position: "relative", width: "100%" }}>
            <StyledInput
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <FaUser />
            </span>
          </div>
        </FormRow>
        <FormRow label="password">
          <div style={{ position: "relative", width: "100%" }}>
            <StyledInput
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </FormRow>
        {error && <p className="error-message">{error}</p>}
        <div
          className="remember-forget"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        <Button type="submit">Login</Button>
      </StyledForm>
    </div>
  );
}

export default Login;
