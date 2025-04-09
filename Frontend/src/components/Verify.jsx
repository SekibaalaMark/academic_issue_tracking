import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import axios from "axios";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or localStorage
  useEffect(() => {
    const userEmail =
      location.state?.email || localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/register");
    }
    setEmail(userEmail);
  }, [location, navigate]);

  // Handle countdown for resend button
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 5) {
      setError("Code must be exactly 5 letters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://your-backend-api/verify-email",
        {
          email,
          verificationCode: code.toUpperCase(), // Convert to uppercase for consistency
        }
      );

      if (response.data.success) {
        setSuccess("Email verified successfully! Redirecting...");
        localStorage.setItem("isVerified", "true");
        setTimeout(() => navigate("/student-complaints"), 2000);
      } else {
        setError(response.data.message || "Verification failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during verification"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://your-backend-api/resend-verification",
        {
          email,
        }
      );

      if (response.data.success) {
        setSuccess("New 5-letter verification code sent to your email!");
      } else {
        setError(response.data.message || "Failed to resend code");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification code"
      );
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, ""); // Only allow letters
    setCode(value.toUpperCase()); // Convert to uppercase
    setError("");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          boxShadow: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Verify Your Email
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
          We've sent a 5-letter verification code to <strong>{email}</strong>.
          <br />
          Please check your inbox and enter the code below.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleVerify}
          sx={{ width: "100%", mt: 1 }}
        >
          <TextField
            fullWidth
            label="Verification Code (5 letters)"
            variant="outlined"
            value={code}
            onChange={handleCodeChange}
            margin="normal"
            required
            inputProps={{
              maxLength: 5,
              style: {
                textTransform: "uppercase",
                letterSpacing: "0.5rem",
                textAlign: "center",
                fontSize: "1.5rem",
              },
            }}
            sx={{
              "& .MuiInputBase-input": {
                textAlign: "center",
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || code.length !== 5}
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Verify Email"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleResendCode}
            disabled={resendDisabled}
            variant="text"
            color="primary"
          >
            {resendDisabled ? `Resend code in ${countdown}s` : "Resend Code"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Didn't receive the email? Check your spam folder or{" "}
          <Link
            component="button"
            onClick={handleResendCode}
            disabled={resendDisabled}
          >
            click here to resend
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
