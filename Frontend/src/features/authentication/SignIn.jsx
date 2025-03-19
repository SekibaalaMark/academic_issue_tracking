import React, { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignIn;
