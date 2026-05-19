import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const Login = () => {
     const [email, setEmail] = React.useState("");
     const [password, setPassword] = React.useState("");
     const [type, setType] = React.useState("password");

     const navigate = useNavigate();

     const handleLogin = (e) => {
          e.preventDefault();
          console.log(email, password);

     }
     return (
          <div className="login-page">
               <div className="login-card">

                    {/* Top Icon */}
                    <div className="login-icon">
                         <i className="fa-solid fa-right-to-bracket"></i>
                    </div>

                    {/* Heading */}
                    <h2>Sign in with email</h2>

                    <p>
                         Track your expenses, manage your budget,
                         and analyze your spending smarter with
                         Spend Analyzer.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleLogin}>

                         <div className="input-box">
                              <i className="fa-solid fa-envelope"></i>

                              <input
                                   type="email"
                                   placeholder="Email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                              />
                         </div>

                         <div className="input-box">
                              <i className="fa-solid fa-lock"></i>

                              <input
                                   type={type === "password" ? "password" : "text"}
                                   placeholder="Password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                              />

                              <i className={`fa-solid ${type === "password" ? "fa-eye-slash" : "fa-eye"} eye`} onClick={() => setType(type === "password" ? "text" : "password")}></i>
                         </div>

                         <div className="forgot-password">
                              <span onClick={() => { navigate('/register') }}>Register</span>
                              <span>Forgot password?</span>
                         </div>

                         <button className="login-btn">
                              Get Started
                         </button>

                    </form>

                    {/* Divider */}
                    <div className="divider">
                         <span>Or sign in with</span>
                    </div>

                    {/* Social Login */}
                    <div className="social-login">

                         <button>
                              <i className="fa-brands fa-google"></i>
                         </button>

                         <button>
                              <i className="fa-brands fa-facebook"></i>
                         </button>

                         <button>
                              <i className="fa-brands fa-apple"></i>
                         </button>

                    </div>

               </div>

          </div>
     );
};

export default Login;