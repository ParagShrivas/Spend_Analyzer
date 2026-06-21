import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/home.css";
import Toast from "../components/toast";
import { useLogin } from "../context/LoginContext";
import Navbar from "../components/navbar";

const API_URL = "http://localhost:1500/user";

const Login = () => {
     const { user, checkingLogin, setUser } = useLogin();

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [type, setType] = useState("password");

     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");
     const [loading, setLoading] = useState(false);

     const [showOtpBox, setShowOtpBox] = useState(false);
     const [otp, setOtp] = useState("");
     const [otpLoading, setOtpLoading] = useState(false);

     const navigate = useNavigate();
     const otpInputRef = useRef(null);

     const showMessage = (message, type = "success") => {
          setToastMessage(message);
          setToastMessageType(type);
          setShowToast(true);
     };

     const safeJson = async (response) => {
          try {
               return await response.json();
          } catch {
               return {};
          }
     };

     useEffect(() => {
          if (!checkingLogin && user) {
               navigate("/dashboard", { replace: true });
          }
     }, [user, checkingLogin, navigate]);

     useEffect(() => {
          window.scrollTo(0, 0);
     }, []);

     useEffect(() => {
          if (!showOtpBox) return;

          const timer = setTimeout(() => {
               otpInputRef.current?.focus();
          }, 150);

          return () => clearTimeout(timer);
     }, [showOtpBox]);

     const handleLogin = async (e) => {
          e.preventDefault();

          try {
               setLoading(true);

               const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         email: email.trim(),
                         password
                    })
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(data.message || "Unable to login.");
               }

               setOtp("");
               setShowOtpBox(true);

               showMessage(
                    data.message || "Verification code sent to your email."
               );
          } catch (error) {
               showMessage(
                    error.message || "An error occurred while logging in.",
                    "error"
               );
          } finally {
               setLoading(false);
          }
     };

     const handleVerifyOtp = async (e) => {
          e.preventDefault();

          if (!/^\d{4}$/.test(otp)) {
               showMessage("Enter a valid 4-digit verification code.", "error");
               return;
          }

          try {
               setOtpLoading(true);

               const response = await fetch(`${API_URL}/verify-login-otp`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         email: email.trim(),
                         otp
                    })
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Incorrect verification code."
                    );
               }

               showMessage("OTP verified successfully!", "success");

               setUser(data.user);
               
               setTimeout(() => {
                    setShowOtpBox(false);
                    navigate("/dashboard", { replace: true });
               }, 1000);
          } catch (error) {
               showMessage(
                    error.message || "Unable to verify the code.",
                    "error"
               );
          } 
     };

     const handleChangeAccount = () => {
          setShowOtpBox(false);
          setOtp("");
          setPassword("");
     };

     return (
          <>
               <div className="login-page">
                    <Toast
                         type={toastMessageType}
                         message={toastMessage}
                         show={showToast}
                         setShow={setShowToast}
                    />

                    <Navbar />

                    <div className="login-card">
                         <div className="login-icon">
                              <i className="fa-solid fa-right-to-bracket"></i>
                         </div>

                         <h2>Sign in with email</h2>

                         <p>
                              Track your expenses, manage your budget, and
                              analyze your spending smarter with Spend Analyzer.
                         </p>

                         <form onSubmit={handleLogin}>
                              <div className="input-box">
                                   <i className="fa-solid fa-envelope"></i>

                                   <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading || showOtpBox}
                                        required
                                   />
                              </div>

                              <div className="input-box">
                                   <i className="fa-solid fa-lock"></i>

                                   <input
                                        type={
                                             type === "password"
                                                  ? "password"
                                                  : "text"
                                        }
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                             setPassword(e.target.value)
                                        }
                                        disabled={loading || showOtpBox}
                                        required
                                   />

                                   <i
                                        className={`fa-solid ${type === "password"
                                                  ? "fa-eye-slash"
                                                  : "fa-eye"
                                             } eye`}
                                        onClick={() =>
                                             setType(
                                                  type === "password"
                                                       ? "text"
                                                       : "password"
                                             )
                                        }
                                   ></i>
                              </div>

                              <div className="forgot-password">
                                   <span onClick={() => navigate("/register")}>
                                        Register
                                   </span>
                                   <span>Forgot password?</span>
                              </div>

                              <button
                                   type="submit"
                                   className="login-btn"
                                   disabled={loading || showOtpBox}
                              >
                                   {loading ? (
                                        <>
                                             Logging in{" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        "Get Started"
                                   )}
                              </button>
                         </form>
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
                              <a>Privacy policy</a>
                              <a>Terms of service</a>
                         </div>
                    </div>

                    <div className="sa-footer-bottom">
                         <span>© 2026 Spend Analyzer. All rights reserved.</span>
                         <span>contact@domain.com</span>
                    </div>
               </footer>

               {showOtpBox && (
                    <div className="login-otp-overlay">
                         <form
                              className="login-otp-box"
                              onSubmit={handleVerifyOtp}
                         >
                              <div className="login-otp-icon">
                                   <i className="fa-solid fa-shield-halved"></i>
                              </div>

                              <h3>Verify your login</h3>

                              <p>
                                   We sent a 4-digit verification code to{" "}
                                   <strong>{email}</strong>.
                              </p>

                              <input
                                   ref={otpInputRef}
                                   type="text"
                                   className="login-otp-input"
                                   inputMode="numeric"
                                   autoComplete="one-time-code"
                                   placeholder="0000"
                                   maxLength="4"
                                   value={otp}
                                   onChange={(e) =>
                                        setOtp(
                                             e.target.value
                                                  .replace(/\D/g, "")
                                                  .slice(0, 4)
                                        )
                                   }
                                   disabled={otpLoading}
                                   required
                              />

                              <button
                                   type="submit"
                                   className="login-otp-btn"
                                   disabled={otpLoading}
                              >
                                   {otpLoading ? (
                                        <>
                                             Verifying{" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        <>
                                             Verify & Continue
                                             <i className="fa-solid fa-arrow-right"></i>
                                        </>
                                   )}
                              </button>

                              <button
                                   type="button"
                                   className="login-otp-back-btn"
                                   onClick={handleChangeAccount}
                                   disabled={otpLoading}
                              >
                                   Use a different account
                              </button>
                         </form>
                    </div>
               )}
          </>
     );
};

export default Login;