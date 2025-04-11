import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const CoverPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Navigate to Login page
  };

  const handleRegister = () => {
    navigate("/register"); // Navigate to Register page
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&h=900&fit=crop"
        alt="Graduation"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Optional overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay for text readability
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          color: "white", // Text color
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Welcome to Academic Issue Tracking
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
            mb: 3,
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          Streamline your academic issue resolution process.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          size="large"
          sx={{
            mt: { xs: 2, sm: 3 },
            px: { xs: 3, sm: 4 },
            py: 1.5,
            fontSize: "1.1rem",
            mr: 2, // Add margin to the right for spacing
          }}
        >
          Login
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleRegister}
          size="large"
          sx={{
            mt: { xs: 2, sm: 3 },
            px: { xs: 3, sm: 4 },
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Register
        </Button>
      </Container>
    </Box>
  );
};

export default CoverPage;
