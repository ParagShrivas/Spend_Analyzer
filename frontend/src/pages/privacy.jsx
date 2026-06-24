import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../css/privacy.css";

export default function Privacy() {
     const navigate = useNavigate();

     useEffect(() => {
          window.scrollTo(0, 0);

          const revealItems = document.querySelectorAll(".sa-privacy-reveal");

          const observer = new IntersectionObserver(
               (entries) => {
                    entries.forEach((entry) => {
                         if (entry.isIntersecting) {
                              entry.target.classList.add("visible");
                         }
                    });
               },
               { threshold: 0.12 }
          );

          revealItems.forEach((item) => observer.observe(item));

          return () => observer.disconnect();
     }, []);

     const privacySections = [
          {
               icon: "fa-database",
               title: "Information We Collect",
               content: (
                    <>
                         <p>
                              Spend Analyzer collects information required to provide
                              expense tracking, budget management, reports, reminders,
                              alerts, and secure account access.
                         </p>

                         <ul>
                              <li>
                                   <strong>Account information:</strong> name, email
                                   address, phone number, and securely hashed password.
                              </li>

                              <li>
                                   <strong>Financial records:</strong> expenses,
                                   amounts, categories, dates, notes, budgets, and
                                   other details you choose to add.
                              </li>

                              <li>
                                   <strong>Reminder information:</strong> reminder
                                   titles, bill alert amounts, dates, times, notes, and
                                   notification preferences.
                              </li>

                              <li>
                                   <strong>Technical details:</strong> browser type,
                                   device details, login activity, cookies, and general
                                   usage information.
                              </li>
                         </ul>
                    </>
               )
          },
          {
               icon: "fa-gears",
               title: "How We Use Your Information",
               content: (
                    <>
                         <p>
                              Your information is used only to operate, secure, and
                              improve Spend Analyzer.
                         </p>

                         <ul>
                              <li>Create and manage your Spend Analyzer account.</li>
                              <li>Store and organize your expenses and budgets.</li>
                              <li>Generate dashboard charts, reports, and insights.</li>
                              <li>Send OTP, password reset, reminder, and bill alert emails.</li>
                              <li>Improve performance, reliability, and user experience.</li>
                              <li>Prevent fraud, misuse, and unauthorized access.</li>
                         </ul>
                    </>
               )
          },
          {
               icon: "fa-shield-halved",
               title: "How We Protect Your Data",
               content: (
                    <>
                         <p>
                              We use reasonable technical and organizational safeguards
                              to help protect your information from unauthorized access,
                              misuse, loss, or alteration.
                         </p>

                         <p>
                              Passwords are stored in hashed form. OTP verification,
                              secure login sessions, and account security checks help
                              protect access to your account.
                         </p>

                         <p>
                              While we work hard to protect your information, no online
                              platform can guarantee complete security. Keep your login
                              details private and use a strong password.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-envelope",
               title: "Emails, OTPs, and Notifications",
               content: (
                    <>
                         <p>
                              Spend Analyzer may send emails for account verification,
                              login OTPs, password reset OTPs, reminder confirmations,
                              bill alerts, and important account-related updates.
                         </p>

                         <p>
                              You can control available notification preferences from
                              your Settings page. Security-related messages may still be
                              sent when needed to protect your account.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-cookie-bite",
               title: "Cookies and Secure Sessions",
               content: (
                    <>
                         <p>
                              Spend Analyzer may use cookies and similar technologies to
                              keep you signed in, maintain secure sessions, remember
                              preferences, and improve the overall experience.
                         </p>

                         <p>
                              You can disable cookies in your browser settings, but some
                              account and login features may not work correctly.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-handshake",
               title: "When We Share Information",
               content: (
                    <>
                         <p>
                              Spend Analyzer does not sell your personal information,
                              expense records, budgets, or financial activity to
                              advertisers.
                         </p>

                         <p>
                              Limited information may be shared with trusted providers
                              that help run the service, including hosting, database,
                              email delivery, analytics, and security providers.
                         </p>

                         <p>
                              Information may also be disclosed when required by law, to
                              respond to valid legal requests, prevent fraud, or protect
                              users and the platform.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-file-export",
               title: "Your Data Choices and Account Deletion",
               content: (
                    <>
                         <p>
                              You can update your profile, manage notification settings,
                              export available data, clear notifications, or request
                              account deletion through Spend Analyzer settings.
                         </p>

                         <p>
                              When an account is deleted, related expenses, budgets,
                              reminders, alerts, and profile details may be removed from
                              active systems, subject to backup, fraud prevention,
                              security, and legal retention requirements.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-pen-to-square",
               title: "Changes to This Privacy Policy",
               content: (
                    <>
                         <p>
                              We may update this Privacy Policy when features, security
                              practices, or legal requirements change.
                         </p>

                         <p>
                              Updates will appear on this page with a revised effective
                              date. By continuing to use Spend Analyzer after changes
                              are posted, you accept the updated policy.
                         </p>
                    </>
               )
          }
     ];

     return (
          <div className="sa-root sa-privacy-page">
               <Navbar />

               <div className="sa-privacy-breadcrumb-wrap">
                    <nav className="sa-privacy-breadcrumb" aria-label="Breadcrumb">
                         <button
                              type="button"
                              onClick={() => navigate("/")}
                              className="sa-privacy-breadcrumb-home"
                         >
                              <i className="fa-solid fa-house"></i>
                              Home
                         </button>

                         <i className="fa-solid fa-chevron-right sa-privacy-breadcrumb-arrow"></i>

                         <span className="sa-privacy-breadcrumb-current">
                              Privacy Policy
                         </span>
                    </nav>
               </div>

               <section className="sa-privacy-hero">
                    <div className="sa-privacy-hero-shape shape-one"></div>
                    <div className="sa-privacy-hero-shape shape-two"></div>

                    <div className="sa-privacy-hero-content">
                         <div className="sa-badge">
                              <i className="fa-solid fa-shield-halved"></i>
                              Privacy & Security
                         </div>

                         <h1>
                              Your financial data deserves{" "}
                              <span>strong protection.</span>
                         </h1>

                         <p>
                              Learn how Spend Analyzer collects, uses, protects, and
                              manages information related to your account, expenses,
                              budgets, reminders, and alerts.
                         </p>

                         <div className="sa-privacy-effective-date">
                              <i className="fa-regular fa-calendar"></i>
                              Effective Date: June 25, 2026
                         </div>
                    </div>
               </section>

               <section className="sa-section sa-privacy-intro-section">
                    <div className="sa-section-head sa-privacy-reveal">
                         <span className="sa-eyebrow">Our Privacy Promise</span>

                         <h2>Simple expense tracking with clear data control</h2>

                         <p>
                              Spend Analyzer is built to help you understand your
                              spending without making privacy complicated. Your financial
                              records stay connected to your account and are used to
                              provide the features you choose to use.
                         </p>
                    </div>
               </section>

               <section className="sa-section sa-privacy-policy-section">
                    <div className="sa-section-head">
                         <span className="sa-eyebrow">Full Privacy Policy</span>

                         <h2>How your information is handled</h2>

                         <p>
                              The sections below explain what data Spend Analyzer uses,
                              why it is needed, and what choices are available to you.
                         </p>
                    </div>

                    <div className="sa-privacy-policy-list">
                         {privacySections.map((section, index) => (
                              <article
                                   className="sa-privacy-policy-card sa-privacy-reveal"
                                   key={section.title}
                              >
                                   <div className="sa-privacy-policy-number">
                                        {String(index + 1).padStart(2, "0")}
                                   </div>

                                   <div className="sa-privacy-policy-icon">
                                        <i className={`fa-solid ${section.icon}`}></i>
                                   </div>

                                   <div className="sa-privacy-policy-content">
                                        <h3>{section.title}</h3>
                                        {section.content}
                                   </div>
                              </article>
                         ))}

                         <article className="sa-privacy-contact-card sa-privacy-reveal">
                              <div className="sa-privacy-contact-icon">
                                   <i className="fa-solid fa-envelope"></i>
                              </div>

                              <div>
                                   <span>Need privacy support?</span>

                                   <h3>Contact Spend Analyzer</h3>

                                   <p>
                                        For privacy, account, or data-related questions,
                                        contact us at:
                                   </p>

                                   <a href="mailto:contact@domain.com">
                                        contact@domain.com
                                   </a>
                              </div>
                         </article>
                    </div>
               </section>

               <section className="sa-section sa-privacy-dark">
                    <div className="sa-section-head">
                         <span className="sa-eyebrow">Security First</span>

                         <h2>Protection built into everyday actions</h2>

                         <p>
                              From secure sign-in to reminders and exports, Spend
                              Analyzer includes practical security features for your
                              account.
                         </p>
                    </div>

                    <div className="sa-privacy-security-grid">
                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-lock"></i>
                              <h4>Hashed Passwords</h4>
                              <p>
                                   Passwords are protected in hashed form rather than
                                   stored as readable plain text.
                              </p>
                         </div>

                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-mobile-screen-button"></i>
                              <h4>OTP Verification</h4>
                              <p>
                                   Time-limited OTP verification adds protection during
                                   important account actions.
                              </p>
                         </div>

                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-cookie-bite"></i>
                              <h4>Secure Sessions</h4>
                              <p>
                                   Secure cookies help keep your session authenticated
                                   while you use the application.
                              </p>
                         </div>

                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-sliders"></i>
                              <h4>Account Controls</h4>
                              <p>
                                   Settings help you manage alerts, privacy options,
                                   exports, and account deletion.
                              </p>
                         </div>
                    </div>
               </section>

               <section className="sa-section">
                    <div className="sa-cta">
                         <h2>Track your expenses with confidence.</h2>

                         <p>
                              Create your Spend Analyzer account and manage your money
                              with secure access, clear insights, and useful controls.
                         </p>

                         <button
                              type="button"
                              className="sa-btn-primary"
                              onClick={() => navigate("/register")}
                              style={{ margin: "0 auto" }}
                         >
                              Create Free Account
                              <i className="fa-solid fa-arrow-right"></i>
                         </button>
                    </div>
               </section>

               <Footer />
          </div>
     );
}