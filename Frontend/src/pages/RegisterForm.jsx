import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
      });
      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error registering. Try again."
      );
    }
  };

  return (
    <div className={styles.formCenter}>
      <Form onSubmit={handleRegister}>
        <h2>REGISTER FORM</h2>
        {message && (
          <p style={{ color: message.includes("Error") ? "red" : "green" }}>
            {message}
          </p>
        )}

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
