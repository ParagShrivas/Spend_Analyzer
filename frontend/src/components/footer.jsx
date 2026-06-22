import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/home.css";

export default function Footer() {
     const navigate = useNavigate();
     const location = useLocation();

     const scrollToSection = (id) => {
          if (location.pathname !== "/") {
               navigate(`/#${id}`);
               return;
          }

          document.getElementById(id)?.scrollIntoView({
               behavior: "smooth",
               block: "start"
          });
     };

     return (
          <footer className="sa-footer">
               <div className="sa-footer-grid">
                    <div>
                         <div
                              className="sa-footer-logo"
                              role="button"
                              tabIndex="0"
                              onClick={() => navigate("/")}
                         >
                              <i className="fa-solid fa-wallet"></i>
                              Spend Analyzer
                         </div>

                         <p>
                              A simple way to log expenses, track budgets, and
                              understand where your money goes — backed by clear
                              charts and exportable history.
                         </p>
                    </div>

                    <div className="sa-footer-col">
                         <h5>Product</h5>

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
                    </div>

                    <div className="sa-footer-col">
                         <h5>Company</h5>

                         <Link to="/">Home</Link>
                         <Link to="/about">About</Link>
                         <Link to="/contact">Contact</Link>
                    </div>

                    <div className="sa-footer-col">
                         <h5>Legal</h5>

                         <Link to="/privacy">Privacy policy</Link>
                         <Link to="/terms">Terms of service</Link>
                    </div>
               </div>

               <div className="sa-footer-bottom">
                    <span>© 2026 Spend Analyzer. All rights reserved.</span>
                    <span>contact@domain.com</span>
               </div>
          </footer>
     );
}