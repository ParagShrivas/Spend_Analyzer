import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/home.css";
import Toast from "../components/toast";
import { useLogin } from "../context/LoginContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const API_URL = "https://spend-analyzer-jg2g.onrender.com/user";

const Login = () => {
     const { user, checkingLogin, setUser } = useLogin();

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [type, setType] = useState("password");

     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");
     const [loading, setLoading] = useState(false);

     // Existing login OTP states
     const [showOtpBox, setShowOtpBox] = useState(false);
     const [otp, setOtp] = useState("");
     const [otpLoading, setOtpLoading] = useState(false);

     // Forgot password states
     const [forgotStep, setForgotStep] = useState(null);
     // null | "email" | "otp" | "reset"

     const [forgotEmail, setForgotEmail] = useState("");
     const [forgotOtp, setForgotOtp] = useState("");
     const [resetToken, setResetToken] = useState("");
     const [newPassword, setNewPassword] = useState("");
     const [confirmNewPassword, setConfirmNewPassword] = useState("");
     const [forgotLoading, setForgotLoading] = useState(false);

     const [newPasswordType, setNewPasswordType] = useState("password");
     const [confirmPasswordType, setConfirmPasswordType] =
          useState("password");

     const navigate = useNavigate();

     const otpInputRef = useRef(null);
     const forgotEmailInputRef = useRef(null);
     const forgotOtpInputRef = useRef(null);
     const newPasswordInputRef = useRef(null);

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

     useEffect(() => {
          if (!forgotStep) return;

          const timer = setTimeout(() => {
               if (forgotStep === "email") {
                    forgotEmailInputRef.current?.focus();
               }

               if (forgotStep === "otp") {
                    forgotOtpInputRef.current?.focus();
               }

               if (forgotStep === "reset") {
                    newPasswordInputRef.current?.focus();
               }
          }, 150);

          return () => clearTimeout(timer);
     }, [forgotStep]);

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
               }, 2000);
          } catch (error) {
               showMessage(
                    error.message || "Unable to verify the code.",
                    "error"
               );
          } finally {
               // Fix: enables OTP input/button again after a wrong OTP.
               setOtpLoading(false);
          }
     };

     const handleChangeAccount = () => {
          setShowOtpBox(false);
          setOtp("");
          setPassword("");
          setOtpLoading(false);
     };

     // Forgot password - open email popup
     const openForgotPassword = () => {
          if (loading || showOtpBox) return;

          setForgotEmail(email.trim());
          setForgotOtp("");
          setResetToken("");
          setNewPassword("");
          setConfirmNewPassword("");
          setForgotStep("email");
     };

     const closeForgotPassword = () => {
          setForgotStep(null);
          setForgotEmail("");
          setForgotOtp("");
          setResetToken("");
          setNewPassword("");
          setConfirmNewPassword("");
          setForgotLoading(false);
     };

     // Step 1: Send reset OTP
     const handleSendForgotOtp = async (e, isResend = false) => {
          e?.preventDefault();

          if (!forgotEmail.trim()) {
               showMessage("Please enter your email address.", "error");
               return;
          }

          try {
               setForgotLoading(true);

               const response = await fetch(`${API_URL}/forgot-password`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         email: forgotEmail.trim()
                    })
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Unable to send verification code."
                    );
               }

               setForgotOtp("");
               setResetToken("");
               setForgotStep("otp");

               showMessage(
                    data.message ||
                         (isResend
                              ? "A new OTP has been sent to your email."
                              : "Password reset OTP sent to your email."),
                    "success"
               );
          } catch (error) {
               showMessage(
                    error.message || "Unable to send password reset OTP.",
                    "error"
               );
          } finally {
               setForgotLoading(false);
          }
     };

     // Step 2: Verify reset OTP
     const handleVerifyForgotOtp = async (e) => {
          e.preventDefault();

          if (!/^\d{4}$/.test(forgotOtp)) {
               showMessage("Enter a valid 4-digit verification code.", "error");
               return;
          }

          try {
               setForgotLoading(true);

               const response = await fetch(
                    `${API_URL}/verify-forgot-password-otp`,
                    {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json"
                         },
                         credentials: "include",
                         body: JSON.stringify({
                              email: forgotEmail.trim(),
                              otp: forgotOtp
                         })
                    }
               );

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Incorrect verification code."
                    );
               }

               const token = data.resetToken || data.token;

               if (!token) {
                    throw new Error(
                         "OTP verified, but reset session was not created."
                    );
               }

               setResetToken(token);
               setForgotStep("reset");

               showMessage(
                    data.message || "OTP verified. Create your new password.",
                    "success"
               );
          } catch (error) {
               showMessage(
                    error.message || "Unable to verify password reset OTP.",
                    "error"
               );
          } finally {
               setForgotLoading(false);
          }
     };

     // Step 3: Save new password
     const handleResetPassword = async (e) => {
          e.preventDefault();

          if (newPassword.length < 6) {
               showMessage(
                    "New password must be at least 6 characters.",
                    "error"
               );
               return;
          }

          if (newPassword !== confirmNewPassword) {
               showMessage("Passwords do not match.", "error");
               return;
          }

          try {
               setForgotLoading(true);

               const response = await fetch(`${API_URL}/reset-password`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                         email: forgotEmail.trim(),
                         resetToken,
                         newPassword
                    })
               });

               const data = await safeJson(response);

               if (!response.ok) {
                    throw new Error(
                         data.message || "Unable to update password."
                    );
               }

               setEmail(forgotEmail.trim());
               setPassword("");
               closeForgotPassword();

               showMessage(
                    data.message ||
                         "Password updated successfully. Please sign in.",
                    "success"
               );
          } catch (error) {
               showMessage(
                    error.message || "Unable to reset password.",
                    "error"
               );
          } finally {
               setForgotLoading(false);
          }
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
                                        onChange={(e) =>
                                             setEmail(e.target.value)
                                        }
                                        disabled={
                                             loading ||
                                             showOtpBox ||
                                             Boolean(forgotStep)
                                        }
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
                                        disabled={
                                             loading ||
                                             showOtpBox ||
                                             Boolean(forgotStep)
                                        }
                                        required
                                   />

                                   <i
                                        className={`fa-solid ${
                                             type === "password"
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

                                   <span onClick={openForgotPassword}>
                                        Forgot password?
                                   </span>
                              </div>

                              <button
                                   type="submit"
                                   className="login-btn"
                                   disabled={
                                        loading ||
                                        showOtpBox ||
                                        Boolean(forgotStep)
                                   }
                              >
                                   {loading ? (
                                        <>
                                             Logging in{" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        "Login"
                                   )}
                              </button>
                         </form>
                    </div>
               </div>

               <Footer/>

               {/* Existing Login OTP Popup */}
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

               {/* Forgot Password - Email */}
               {forgotStep === "email" && (
                    <div className="login-otp-overlay">
                         <form
                              className="login-otp-box"
                              onSubmit={handleSendForgotOtp}
                         >
                              <div className="login-otp-icon">
                                   <i className="fa-solid fa-key"></i>
                              </div>

                              <h3>Forgot password?</h3>

                              <p>
                                   Enter your registered email address to receive
                                   a password-reset OTP.
                              </p>

                              <div className="input-box">
                                   <i className="fa-solid fa-envelope"></i>

                                   <input
                                        ref={forgotEmailInputRef}
                                        type="email"
                                        placeholder="Enter your email"
                                        value={forgotEmail}
                                        onChange={(e) =>
                                             setForgotEmail(e.target.value)
                                        }
                                        disabled={forgotLoading}
                                        required
                                   />
                              </div>

                              <button
                                   type="submit"
                                   className="login-otp-btn"
                                   disabled={forgotLoading}
                              >
                                   {forgotLoading ? (
                                        <>
                                             Sending OTP{" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        <>
                                             Send OTP
                                             <i className="fa-solid fa-paper-plane"></i>
                                        </>
                                   )}
                              </button>

                              <button
                                   type="button"
                                   className="login-otp-back-btn"
                                   onClick={closeForgotPassword}
                                   disabled={forgotLoading}
                              >
                                   Back to login
                              </button>
                         </form>
                    </div>
               )}

               {/* Forgot Password - OTP */}
               {forgotStep === "otp" && (
                    <div className="login-otp-overlay">
                         <form
                              className="login-otp-box"
                              onSubmit={handleVerifyForgotOtp}
                         >
                              <div className="login-otp-icon">
                                   <i className="fa-solid fa-shield-halved"></i>
                              </div>

                              <h3>Verify reset OTP</h3>

                              <p>
                                   We sent a 4-digit verification code to{" "}
                                   <strong>{forgotEmail}</strong>.
                              </p>

                              <input
                                   ref={forgotOtpInputRef}
                                   type="text"
                                   className="login-otp-input"
                                   inputMode="numeric"
                                   autoComplete="one-time-code"
                                   placeholder="0000"
                                   maxLength="4"
                                   value={forgotOtp}
                                   onChange={(e) =>
                                        setForgotOtp(
                                             e.target.value
                                                  .replace(/\D/g, "")
                                                  .slice(0, 4)
                                        )
                                   }
                                   disabled={forgotLoading}
                                   required
                              />

                              <button
                                   type="submit"
                                   className="login-otp-btn"
                                   disabled={forgotLoading}
                              >
                                   {forgotLoading ? (
                                        <>
                                             Verifying{" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        <>
                                             Verify OTP
                                             <i className="fa-solid fa-arrow-right"></i>
                                        </>
                                   )}
                              </button>

                              <button
                                   type="button"
                                   className="login-otp-back-btn"
                                   onClick={() =>
                                        handleSendForgotOtp(null, true)
                                   }
                                   disabled={forgotLoading}
                              >
                                   Resend OTP
                              </button>
                                   <br />
                              <button
                                   type="button"
                                   className="login-otp-back-btn"
                                   onClick={() => setForgotStep("email")}
                                   disabled={forgotLoading}
                              >
                                   Change email address
                              </button>
                         </form>
                    </div>
               )}

               {/* Forgot Password - New Password */}
               {forgotStep === "reset" && (
                    <div className="login-otp-overlay">
                         <form
                              className="login-otp-box"
                              onSubmit={handleResetPassword}
                         >
                              <div className="login-otp-icon">
                                   <i className="fa-solid fa-lock"></i>
                              </div>

                              <h3>Create new password</h3>

                              <p>
                                   Your OTP is verified. Create a new secure
                                   password for your account.
                              </p>

                              <div className="input-box">
                                   <i className="fa-solid fa-lock"></i>

                                   <input
                                        ref={newPasswordInputRef}
                                        type={newPasswordType}
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) =>
                                             setNewPassword(e.target.value)
                                        }
                                        disabled={forgotLoading}
                                        required
                                   />

                                   <i
                                        className={`fa-solid ${
                                             newPasswordType === "password"
                                                  ? "fa-eye-slash"
                                                  : "fa-eye"
                                        } eye`}
                                        onClick={() =>
                                             !forgotLoading &&
                                             setNewPasswordType(
                                                  newPasswordType === "password"
                                                       ? "text"
                                                       : "password"
                                             )
                                        }
                                   ></i>
                              </div>

                              <div className="input-box">
                                   <i className="fa-solid fa-shield-halved"></i>

                                   <input
                                        type={confirmPasswordType}
                                        placeholder="Confirm new password"
                                        value={confirmNewPassword}
                                        onChange={(e) =>
                                             setConfirmNewPassword(
                                                  e.target.value
                                             )
                                        }
                                        disabled={forgotLoading}
                                        required
                                   />

                                   <i
                                        className={`fa-solid ${
                                             confirmPasswordType === "password"
                                                  ? "fa-eye-slash"
                                                  : "fa-eye"
                                        } eye`}
                                        onClick={() =>
                                             !forgotLoading &&
                                             setConfirmPasswordType(
                                                  confirmPasswordType ===
                                                       "password"
                                                       ? "text"
                                                       : "password"
                                             )
                                        }
                                   ></i>
                              </div>

                              <button
                                   type="submit"
                                   className="login-otp-btn"
                                   disabled={forgotLoading}
                              >
                                   {forgotLoading ? (
                                        <>
                                             Updating Password{" "}
                                             <i className="fa-solid fa-spinner fa-spin"></i>
                                        </>
                                   ) : (
                                        <>
                                             Update Password
                                             <i className="fa-solid fa-check"></i>
                                        </>
                                   )}
                              </button>

                              <button
                                   type="button"
                                   className="login-otp-back-btn"
                                   onClick={() => setForgotStep("otp")}
                                   disabled={forgotLoading}
                              >
                                   Back to OTP verification
                              </button>
                         </form>
                    </div>
               )}
          </>
     );
};

export default Login;
