import React from "react";
import "./Login.css"; // Import the CSS file

const Login = () => {
  return (
    <div className="login-page">
      <div className="top-right-links">
        <a href="#">Login</a>
        <a href="#">Register</a>
      </div>

      <h2>FAMS</h2>

      <div className="container">
        <div className="header">Login</div>
        <div className="form-container">
          <form action="#" method="POST">
            <label htmlFor="email">E-Mail Address</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />

            <div className="checkbox-container">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="links">
            <a href="#">Forgot Your Password?</a>
            <a href="#">Trouble Login?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;