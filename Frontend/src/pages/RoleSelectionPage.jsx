import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";

const roles = [
  { label: "Student", value: "student", color: "primary" },
  { label: "Lecturer", value: "lecturer", color: "secondary" },
  {
    label: "Academic Registrar",
    value: "academic-registrar",
    color: "success",
  },
];

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Select Your Role
      </Typography>
      {roles.map((role) => (
        <Button
          key={role.value}
          fullWidth
          variant="contained"
          color={role.color}
          style={{ marginBottom: "16px" }}
          onClick={() => handleRoleSelect(role.value)}
        >
          {role.label}
        </Button>
      ))}
    </Container>
  );
};

export default RoleSelectionPage;
