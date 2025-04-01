import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";

const Verify = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    const storedCode = localStorage.getItem("verificationCode");

    if (code === storedCode) {
      localStorage.setItem("isVerified", "true"); // Mark user as verified
      alert("Verification successful! You can now log in.");
      navigate("/login"); // Redirect to login page
    } else {
      alert("Invalid verification code. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Verify Your Email
      </Typography>
      <TextField
        fullWidth
        label="Enter Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        margin="normal"
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleVerify}
      >
        Verify
      </Button>
    </Container>
  );
};

export default Verify;
