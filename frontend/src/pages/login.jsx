import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/home.css"
import Toast from "../components/toast";
import { useLogin } from "../context/LoginContext";

const Login = () => {
     const { user, checkingLogin } = useLogin();

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [type, setType] = useState("password");

     const navigate = useNavigate();
     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");
     const [loading, setLoading] = useState(false);
     const [scrolled, setScrolled] = useState(false);
     const [mobileOpen, setMobileOpen] = useState(false);

     useEffect(() => {
          if (!checkingLogin && user) {
               navigate("/dashboard", { replace: true });
          }
     }, [user, checkingLogin, navigate]);

     const handleLogin = async (e) => {
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
                    setToastMessage("Login successful! Redirecting...");
                    setToastMessageType("success");

                    setTimeout(() => {
                         setShowToast(false);
                         navigate('/dashboard', { replace: true });
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
          <>
               <div className="login-page">
                    {/* NAVBAR */}
                    <nav className={`sa-nav ${scrolled ? "scrolled" : ""}`}>
                         <div className="sa-logo" onClick={() => navigate('/')}>
                              <div className="sa-logo-icon">
                                   <i className="fa-solid fa-wallet"></i>
                              </div>
                              Spend Analyzer
                         </div>

                         <div className="sa-auth-btns">
                              <button type="button" className="sa-btn-login" onClick={() => navigate('/login')}>
                                   Log in
                              </button>

                              <button type="button" className="sa-btn-signup" onClick={() => navigate('/register')}>
                                   Sign up
                              </button>
                         </div>

                         <button
                              type="button"
                              className="sa-burger"
                              onClick={() => setMobileOpen(!mobileOpen)}
                         >
                              <i
                                   className={
                                        mobileOpen
                                             ? "fa-solid fa-xmark"
                                             : "fa-solid fa-bars"
                                   }
                              ></i>
                         </button>
                    </nav>

                    {mobileOpen && (
                         <div className="sa-mobile-menu">

                              <button
                                   type="button"
                                   className="sa-btn-login"
                                   style={{ width: "100%" }}
                                   onClick={() => navigate('/login')}
                              >
                                   Log in
                              </button>

                              <button
                                   type="button"
                                   className="sa-btn-signup"
                                   style={{ width: "100%" }}
                                   onClick={() => navigate('/register')}
                              >
                                   Sign up free
                              </button>
                         </div>
                    )}
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
                         {/* <div className="divider">
                              <span>Or sign in with</span>
                         </div> */}

                         {/* Social Login */}
                         {/* <div className="social-login">

                              <button>
                                   <i className="fa-brands fa-google"></i>
                              </button>

                              <button>
                                   <i className="fa-brands fa-facebook"></i>
                              </button>

                              <button>
                                   <i className="fa-brands fa-apple"></i>
                              </button>

                         </div> */}

                    </div>
               </div>
               <footer className="sa-footer">
                    <div className="sa-footer-grid">
                         <div>
                              <div className="sa-footer-logo">
                                   <i className="fa-solid fa-wallet"></i>
                                   Spend Analyzer
                              </div>

                              <p>
                                   A simple way to log expenses, track budgets,
                                   and understand where your money goes — backed
                                   by clear charts and exportable history.
                              </p>
                         </div>

                         <div className="sa-footer-col">
                              <h5>Product</h5>
                              <a>Features</a>
                              <a>How it works</a>
                              <a>Pricing</a>
                         </div>

                         <div className="sa-footer-col">
                              <h5>Company</h5>
                              <a>Home</a>
                              <a>About</a>
                              <a>Contact</a>
                         </div>

                         <div className="sa-footer-col">
                              <h5>Legal</h5>
                              <a >
                                   Privacy policy
                              </a>
                              <a >
                                   Terms of service
                              </a>
                         </div>
                    </div>

                    <div className="sa-footer-bottom">
                         <span>
                              © 2026 Spend Analyzer. All rights reserved.
                         </span>
                         <span>contact@domain.com</span>
                    </div>
               </footer>
          </>
     );
};

export default Login;