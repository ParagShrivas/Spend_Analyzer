import React, { useEffect, useState } from "react";
import "../css/home.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
     const [scrolled, setScrolled] = useState(false);
     const [mobileOpen, setMobileOpen] = useState(false);

     const navigate = useNavigate();
     const location = useLocation();

     const scrollToSection = (id) => {
          setMobileOpen(false);

          if (location.pathname !== "/") {
               navigate({
                    pathname: "/",
                    hash: `#${id}`
               });

               return;
          }

          document.getElementById(id)?.scrollIntoView({
               behavior: "smooth",
               block: "start"
          });
     };

     useEffect(() => {
          const onScroll = () => setScrolled(window.scrollY > 20);

          window.addEventListener("scroll", onScroll);

          return () => window.removeEventListener("scroll", onScroll);
     }, []);

     return (
          <>
               <nav className={`sa-nav ${scrolled ? "scrolled" : ""}`}>
                    <div
                         className="sa-logo"
                         onClick={() => navigate("/")}
                         role="button"
                         tabIndex="0"
                    >
                         <div className="sa-logo-icon">
                              <i className="fa-solid fa-wallet"></i>
                         </div>
                         Spend Analyzer
                    </div>

                    <div className="sa-links">
                         <a
                              href="/about"
                         >
                              About
                         </a>
                         <a
                              href="#features"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("features");
                              }}
                         >
                              Features
                         </a>

                         <a
                              href="#how-it-works"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("how-it-works");
                              }}
                         >
                              How it works
                         </a>

                         <a
                              href="#analysis"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("analysis");
                              }}
                         >
                              Analysis
                         </a>

                         <a
                              href="#faq"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("faq");
                              }}
                         >
                              FAQ
                         </a>
                    </div>

                    <div className="sa-auth-btns">
                         <button
                              type="button"
                              className="sa-btn-login"
                              onClick={() => navigate("/login")}
                         >
                              Log in
                         </button>

                         <button
                              type="button"
                              className="sa-btn-signup"
                              onClick={() => navigate("/register")}
                         >
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
                         <a
                              href="#features"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("features");
                              }}
                         >
                              Features
                         </a>

                         <a
                              href="#how-it-works"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("how-it-works");
                              }}
                         >
                              How it works
                         </a>

                         <a
                              href="#analysis"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("analysis");
                              }}
                         >
                              Analysis
                         </a>

                         <a
                              href="#faq"
                              onClick={(e) => {
                                   e.preventDefault();
                                   scrollToSection("faq");
                              }}
                         >
                              FAQ
                         </a>

                         <button
                              type="button"
                              className="sa-btn-login"
                              style={{ width: "100%" }}
                              onClick={() => navigate("/login")}
                         >
                              Log in
                         </button>

                         <button
                              type="button"
                              className="sa-btn-signup"
                              style={{ width: "100%" }}
                              onClick={() => navigate("/register")}
                         >
                              Sign up free
                         </button>
                    </div>
               )}
          </>
     );
}