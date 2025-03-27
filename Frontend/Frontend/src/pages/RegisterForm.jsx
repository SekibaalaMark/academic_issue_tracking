import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import axios from "axios"; // Make sure to install axios
import Button from "../ui/Button";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Option from "../ui/Option";
import Select from "../ui/Select";
import styles from "./register.module.css";

function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("/api/register", {
        firstName,
        lastName,
        username,
        email,
        password,
        role, // Include the role in the registration
      });
      setSuccess("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      setError("Error registering. Try again.");
    }
  };

  return (
    <div className={styles.formCenter}>
      <Form onSubmit={handleRegister}>
        <h2>REGISTER FORM</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <FormRow label="First Name">
          <Input
            placeholder="Enter First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </FormRow>
        <FormRow label="Last Name">
          <Input
            placeholder="Enter Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </FormRow>
        <FormRow label="Username">
          <Input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormRow>
        <FormRow label="Password">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormRow>
        <FormRow label="Confirm Password">
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormRow>
        <FormRow label="Email">
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormRow>
        <FormRow label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <Option value="student">Student</Option>
            <Option value="admin">Lecturer</Option>
            <Option value="doctor">Academic Registrar</Option>
          </Select>
        </FormRow>
        <Button type="submit">Register</Button>
        <p className={styles.redirectText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Form>
    </div>
  );
}

export default RegisterForm;
