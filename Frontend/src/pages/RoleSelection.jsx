import React from "react";
import { Container, Typography, Button } from "@mui/material";

const RoleSelection = () => {
  const handleRoleSelect = (role) => {
    console.log(`Selected role: ${role}`);
    // Add logic to handle role selection
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        textAlign: "center",
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Select Your Role
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleRoleSelect("Student")}
        style={{ margin: "10px" }}
      >
        Student
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleRoleSelect("Teacher")}
        style={{ margin: "10px" }}
      >
        Teacher
      </Button>
    </Container>
  );
};

export default RoleSelection;
