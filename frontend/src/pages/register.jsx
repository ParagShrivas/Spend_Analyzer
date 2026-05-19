import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const Register = () => {

     const [name, setName] = React.useState("");
     const [email, setEmail] = React.useState("");
     const [password, setPassword] = React.useState("");
     const [confirmPassword, setConfirmPassword] = React.useState("");
     const [type, setType] = React.useState("password");

     const navigate = useNavigate();

     const handleRegister = (e) => {
          e.preventDefault();

          if (password !== confirmPassword) {
               alert("Passwords do not match");
               return;
          }

          console.log(name, email, password);
     };

     return (
          <div className="login-page">

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
                              Create Account
                         </button>

                    </form>

                    {/* Divider */}
                    <div className="divider">
                         <span>Or sign up with</span>
                    </div>

                    {/* Social Login */}
                    <div className="social-login">

                         <button type="button">
                              <i className="fa-brands fa-google"></i>
                         </button>

                         <button type="button">
                              <i className="fa-brands fa-facebook"></i>
                         </button>

                         <button type="button">
                              <i className="fa-brands fa-apple"></i>
                         </button>

                    </div>

               </div>

          </div>
     );
};

export default Register;