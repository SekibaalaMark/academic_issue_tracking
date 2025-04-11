import React from 'react';
import './LoginForm.css';
import { FaCircleUser,FaLock } from "react-icons/fa6";

const LoginForm =() => {
          return (
                    <div classname ='wrapper'>
                      <form action ="">
                        <h1>Login</h1>
                        <div className="input-box">

                        <input type="text" placeholder="username" required/>
                        </div>
                        <FaCircleUser className='icon' />
                        <div className="input-box">

                        <input type="password" placeholder="Password" required/>
                        </div>
                        <FaLock className='icon'/>
                        <div className="remember-forget"></div>
                        <label> <input type ="checkbox"/>Remember me</label>
                        <a href='#'>Forgot Password?</a>
                      </form>
                      <button type ="submit">Login </button>
                      <div className="register-link"></div>
                      <p>Don't have an account?<a href ="#">Register 
                      </a></p>
                             
                    </div>
          )
}

export default LoginForm;


