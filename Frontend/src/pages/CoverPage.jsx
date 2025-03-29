import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CoverPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      style={{
        textAlign: "center",
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" gutterBottom>
        Academic Issue Tracking System
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Streamline your academic issue resolution process.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/role-selection")}
        style={{ marginTop: "20px" }}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default CoverPage;
