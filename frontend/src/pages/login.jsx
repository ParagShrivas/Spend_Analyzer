import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import Toast from "../components/toast";

const Login = () => {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [type, setType] = useState("password");

     const navigate = useNavigate();
     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");
     const [loading, setLoading] = useState(false);

     const handleLogin = async(e) => {
          e.preventDefault();

          setLoading(true);
          try {
               // API call to login the user
               const response = await fetch("http://localhost:1500/user/login", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: "include"
               });

               const data = await response.json();

               if (response.ok) {
                    setShowToast(true);
                    setToastMessage("Login successful!");
                    setToastMessageType("success");

                    setTimeout(() => {
                         setShowToast(false);
                         navigate('/dashboard');
                    }, 2000);

               } else {
                    setShowToast(true);
                    setToastMessage(data.message);
                    setToastMessageType("error");
               }
          } catch (err) {
               setShowToast(true);
               setToastMessage("An error occurred while logging in.");
               setToastMessageType("error");
          } finally {
               setLoading(false);
          }
     }
     return (
          <div className="login-page">
               <Toast type={toastMessageType} message={toastMessage} show={showToast} setShow={setShowToast} />
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
                                   required
                              />
                         </div>

                         <div className="input-box">
                              <i className="fa-solid fa-lock"></i>

                              <input
                                   type={type === "password" ? "password" : "text"}
                                   placeholder="Password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   required
                              />

                              <i className={`fa-solid ${type === "password" ? "fa-eye-slash" : "fa-eye"} eye`} onClick={() => setType(type === "password" ? "text" : "password")}></i>
                         </div>

                         <div className="forgot-password">
                              <span onClick={() => { navigate('/register') }}>Register</span>
                              <span>Forgot password?</span>
                         </div>

                         <button className="login-btn">
                              {
                                   loading ? (
                                        <>
                                             Logging in
                                             {" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        <>
                                             Get Started
                                        </>
                                   )
                              }
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