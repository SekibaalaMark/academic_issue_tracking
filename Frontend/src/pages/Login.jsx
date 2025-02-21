// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import styled from "styled-components"
const Input=styled.input`
padding:8px 12px;
border-radius: 5px;
border: 1px solid #ddd


`
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your API URL
      const response = await axios.post("http://your-api-endpoint/login", { email, password });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store token
        window.location.href = '/dashboard'; // Redirect to dashboard
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
       
          />
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
