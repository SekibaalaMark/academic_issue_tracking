import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Button from "../ui/Button";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Option from "../ui/Option";
import Select from "../ui/Select";
import styles from "./register.module.css";
import Dropdown from "./components/Dropdown/Dropdown.jsx";

function RegisterForm() {
  return (
    <div className={styles.formCenter}>
      <Form>
        <h2>REGISTER FORM</h2>
        <FormRow label="First Name">
          <Input placeholder="Enter First name" required />
        </FormRow>
        <FormRow label="Last Name">
          <Input placeholder="Enter Last name" required />
        </FormRow>
        <FormRow label="Username">
          <Input placeholder="Enter Username" required />
        </FormRow>
        <FormRow label="password">
          <Input placeholder="Enter password" required />
        </FormRow>
        <FormRow label="Confirm password">
          <Input placeholder="Confirm password" required />
        </FormRow>
        <FormRow label="Email">
          <Input placeholder="Enter email" required />
        </FormRow>
        <Dropdown />

        {/* <FormRow label="Registration number">
          <Input placeholder="Enter registration number" required />
        </FormRow>
        <FormRow label="Student number">
          <Input placeholder="Enter student number" required />
        </FormRow>
        <FormRow label="College">
          <Input placeholder="Enter college" required />
        </FormRow>
        <FormRow label="Department">
          <Input placeholder="Department" required />
        </FormRow>
        <FormRow label="Academic year">
          <Input placeholder="Academic Year" required />
        </FormRow>
        <FormRow label="Select College">
          <Select>
            <Option>COCIS</Option>
            <Option>CEES</Option>
            <Option>CAES</Option>
            <Option>COBAMS</Option>
          </Select>
        </FormRow> */}
        <Button>Register</Button>
        <p className={styles.redirectText}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Form>
    </div>
  );
}

export default RegisterForm;
