import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    localStorage.setItem("selectedRole", selectedRole);
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Select Your Role
      </Typography>
      {["student", "lecturer", "academic-registrar"].map((role) => (
        <Button
          key={role}
          variant="contained"
          color="primary"
          onClick={() => handleRoleSelect(role)}
          style={{ margin: "10px" }}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Button>
      ))}
    </Container>
  );
};

export default RoleSelectionPage;
