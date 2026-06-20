import React from "react";
import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import Toast from "../components/toast";
import Navbar from "../components/navbar"

const Register = () => {

     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");
     const [type, setType] = useState("password");
     const [showToast, setShowToast] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
     const [toastMessageType, setToastMessageType] = useState("");
     const [loading, setLoading] = useState(false);

     const navigate = useNavigate();

     useEffect(() => {
          window.scrollTo({
               top: 0,
               behavior: "smooth"
          });
     }, []);

     const handleRegister = async (e) => {
          e.preventDefault();

          if (password !== confirmPassword) {
               setShowToast(true);

               setToastMessage("Passwords are not matching!");

               setToastMessageType("info");
               return;
          }

          setLoading(true);
          try {
               // API call to register the user
               const response = await fetch("http://localhost:1500/user/register", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                         name,
                         email,
                         password
                    })
               })

               const data = await response.json();

               if (response.ok) {
                    setShowToast(true);
                    setToastMessage("Registration successful! Please login.");
                    setToastMessageType("success");

                    setTimeout(() => {
                         window.location.href = '/login'
                    }, 1000);
               }

               else if (!response.ok) {
                    setShowToast(true);
                    setToastMessage(data.message);
                    setToastMessageType("info");
               }
          } catch (err) {
               setShowToast(true);
               setToastMessage("An error occurred while registering.");
               setToastMessageType("error");
          }
          setLoading(false);
     };

     return (
          <>
               <div className="login-page">
                    <Toast type={toastMessageType} message={toastMessage} show={showToast} setShow={setShowToast} />
                    <Navbar />
                    <div className="login-card">

                         {/* Top Icon */}
                         <div className="login-icon">
                              <i className="fa-solid fa-user-plus"></i>
                         </div>

                         {/* Heading */}
                         <h2>Create Account</h2>

                         <p>
                              Create your Spend Analyzer account
                              and start tracking your expenses
                              smarter and faster.
                         </p>

                         {/* Form */}
                         <form onSubmit={handleRegister}>

                              {/* Name */}
                              <div className="input-box">
                                   <i className="fa-solid fa-user"></i>

                                   <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                   />
                              </div>

                              {/* Email */}
                              <div className="input-box">
                                   <i className="fa-solid fa-envelope"></i>

                                   <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                   />
                              </div>

                              {/* Password */}
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
                                        onChange={(e) => setPassword(e.target.value)}
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

                              {/* Confirm Password */}
                              <div className="input-box">
                                   <i className="fa-solid fa-lock"></i>

                                   <input
                                        type={
                                             type === "password"
                                                  ? "password"
                                                  : "text"
                                        }
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                             setConfirmPassword(e.target.value)
                                        }
                                   />
                              </div>

                              {/* Login Redirect */}
                              <div className="forgot-password">
                                   <span
                                        onClick={() => {
                                             navigate("/login");
                                        }}
                                   >
                                        Already have an account?
                                   </span>
                              </div>

                              {/* Button */}
                              <button className="login-btn">

                                   {
                                        loading ? (
                                             <>
                                                  Creating Account
                                                  {" "}
                                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                             </>
                                        ) : (
                                             <>
                                                  Create Account
                                             </>
                                        )
                                   }

                              </button>

                         </form>

                         {/* Divider */}
                         {/* <div className="divider">
                         <span>Or sign up with</span>
                    </div> */}

                         {/* Social Login */}
                         {/* <div className="social-login">

                         <button type="button">
                              <i className="fa-brands fa-google"></i>
                         </button>

                         <button type="button">
                              <i className="fa-brands fa-facebook"></i>
                         </button>

                         <button type="button">
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

export default Register;