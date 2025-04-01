import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import graduation1 from "@/assets/graduationImage/graduation1.png";

const CoverPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    console.log("Get Started button clicked"); // Debugging line
    navigate("/role-selection"); // Navigate to RoleSelectionPage
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <div><img src="graduation1.png" className="Image" alt="GRADUATION" /></div>
      <Typography variant="h3" gutterBottom>
        Welcome to Academic Issue Tracking
      </Typography>
      <Typography variant="h6" gutterBottom>
        Streamline your academic issue resolution process.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleStart}
        style={{ marginTop: "20px" }}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default CoverPage;
