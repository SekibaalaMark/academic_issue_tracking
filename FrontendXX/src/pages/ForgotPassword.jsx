import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const formStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '60px auto',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0 20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#005080',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
  };

  const messageStyle = {
    color: 'green',
    fontWeight: '500',
    marginBottom: '15px',
  };

  const errorStyle = {
    color: 'red',
    fontWeight: '500',
    marginBottom: '15px',
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/forgot-password/', { email });
      setStep(2);
      setMessage('Reset token sent to your email.');
      setError('');
    } catch (err) {
      setError('Email not found or failed to send token.');
      setMessage('');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reset-password/', {
        email,
        token,
        new_password: newPassword,
      });
      setMessage('Password reset successful. You can now log in.');
      setError('');
    } catch (err) {
      setError('Failed to reset password. Check your token.');
      setMessage('');
    }
  };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#004080' }}>
        Forgot Password
      </h2>

      {message && <p style={messageStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <label style={labelStyle}>Enter Your Email:</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Send Reset Token
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetSubmit}>
          <label style={labelStyle}>Enter Token:</label>
          <input
            type="text"
            placeholder="Enter the token from your email"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            style={inputStyle}
          />
          <label style={labelStyle}>New Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
