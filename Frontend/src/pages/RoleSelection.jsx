import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";

const RoleSelection = () => {
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
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => handleRoleSelect("student")}
        style={{ marginBottom: "16px" }}
      >
        Student
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        onClick={() => handleRoleSelect("lecturer")}
        style={{ marginBottom: "16px" }}
      >
        Lecturer
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="default"
        onClick={() => handleRoleSelect("academic-registrar")}
      >
        Academic Registrar
      </Button>
    </Container>
  );
};

export default RoleSelection;
