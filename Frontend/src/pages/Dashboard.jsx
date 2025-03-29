import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";

const Dashboard = () => {
  const { role } = useParams();

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography variant="h6">
        Role: {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown"}
      </Typography>
    </Container>
  );
};

export default Dashboard;
