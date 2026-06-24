import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../css/privacy.css";

export default function Terms() {
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

     const termsSections = [
          {
               icon: "fa-file-signature",
               title: "Acceptance of These Terms",
               content: (
                    <>
                         <p>
                              By creating an account, accessing, or using Spend
                              Analyzer, you agree to follow these Terms and
                              Conditions. These terms apply to all features,
                              dashboards, reports, reminders, alerts, and account
                              services available through the platform.
                         </p>

                         <p>
                              Do not use Spend Analyzer if you do not agree with
                              these terms.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-user-check",
               title: "Account Registration and Responsibility",
               content: (
                    <>
                         <p>
                              You are responsible for providing accurate information
                              when creating your account and for keeping your login
                              credentials confidential.
                         </p>

                         <ul>
                              <li>
                                   Use a valid email address that you can access.
                              </li>
                              <li>
                                   Keep your password, OTP, and login details private.
                              </li>
                              <li>
                                   Notify us if you believe your account has been used
                                   without permission.
                              </li>
                              <li>
                                   You are responsible for activity carried out through
                                   your account.
                              </li>
                         </ul>
                    </>
               )
          },
          {
               icon: "fa-wallet",
               title: "Expense, Budget, and Reminder Information",
               content: (
                    <>
                         <p>
                              Spend Analyzer allows you to add expenses, budgets,
                              reminders, bill alerts, notes, and categories for your
                              own personal record keeping.
                         </p>

                         <p>
                              You are responsible for ensuring that the information you
                              enter is accurate. Spend Analyzer does not independently
                              verify transaction amounts, payment dates, bank balances,
                              or financial records entered by users.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-chart-line",
               title: "Financial Information Disclaimer",
               content: (
                    <>
                         <p>
                              Spend Analyzer provides expense tracking, visual reports,
                              budgeting tools, and reminders for informational and
                              organizational purposes only.
                         </p>

                         <p>
                              The platform does not provide financial, investment, tax,
                              accounting, legal, or credit advice. Decisions made using
                              information shown in the app are your responsibility.
                         </p>

                         <p>
                              Consider consulting a qualified professional before making
                              important financial decisions.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-bell",
               title: "Reminders and Bill Alerts",
               content: (
                    <>
                         <p>
                              Reminder and alert features are designed to help you stay
                              organized. You remain responsible for reviewing your
                              schedules, due dates, bills, and payments.
                         </p>

                         <p>
                              Email delivery, notifications, internet connectivity, and
                              device settings can affect whether an alert is received.
                              Spend Analyzer cannot guarantee that every reminder or
                              alert will be delivered or seen at a specific time.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-user-shield",
               title: "Acceptable Use",
               content: (
                    <>
                         <p>
                              You agree to use Spend Analyzer lawfully and responsibly.
                              You must not:
                         </p>

                         <ul>
                              <li>
                                   Attempt to access another person's account or data.
                              </li>
                              <li>
                                   Use the platform to upload harmful, misleading, or
                                   unlawful content.
                              </li>
                              <li>
                                   Try to disrupt, damage, overload, or interfere with
                                   the service or its security.
                              </li>
                              <li>
                                   Copy, reverse engineer, or misuse the platform,
                                   except where permitted by applicable law.
                              </li>
                              <li>
                                   Use automated tools to access the service without
                                   permission.
                              </li>
                         </ul>
                    </>
               )
          },
          {
               icon: "fa-gears",
               title: "Service Availability and Changes",
               content: (
                    <>
                         <p>
                              We may update, improve, pause, limit, or remove features
                              of Spend Analyzer when necessary for maintenance,
                              security, performance, legal compliance, or product
                              improvements.
                         </p>

                         <p>
                              We aim to keep the service available and reliable, but we
                              cannot guarantee uninterrupted access at all times.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-copyright",
               title: "Intellectual Property",
               content: (
                    <>
                         <p>
                              The Spend Analyzer name, branding, interface, design,
                              source code, content, icons, and features are protected
                              by applicable intellectual property laws.
                         </p>

                         <p>
                              You may use the platform for its intended personal
                              expense-management purpose. You may not copy, sell,
                              distribute, or create derivative versions of the platform
                              without permission.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-ban",
               title: "Suspension or Termination",
               content: (
                    <>
                         <p>
                              We may suspend or terminate access to Spend Analyzer if we
                              reasonably believe that an account is being used in a way
                              that violates these terms, creates security risks, harms
                              other users, or breaches applicable laws.
                         </p>

                         <p>
                              You may stop using Spend Analyzer and request deletion of
                              your account through available account settings.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-scale-balanced",
               title: "Limitation of Liability",
               content: (
                    <>
                         <p>
                              To the maximum extent permitted by applicable law, Spend
                              Analyzer is not responsible for indirect, incidental,
                              special, or consequential losses arising from your use of
                              the platform.
                         </p>

                         <p>
                              This includes losses related to missed payments, incorrect
                              records, unavailable alerts, data-entry errors, or
                              decisions made using financial summaries shown in the app.
                         </p>
                    </>
               )
          },
          {
               icon: "fa-pen-to-square",
               title: "Changes to These Terms",
               content: (
                    <>
                         <p>
                              We may revise these Terms and Conditions when features,
                              security practices, legal requirements, or service
                              operations change.
                         </p>

                         <p>
                              The latest version will be posted on this page with an
                              updated effective date. Continued use of Spend Analyzer
                              after changes are posted means that you accept the
                              updated terms.
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
                              Terms & Conditions
                         </span>
                    </nav>
               </div>

               <section className="sa-privacy-hero">
                    <div className="sa-privacy-hero-shape shape-one"></div>
                    <div className="sa-privacy-hero-shape shape-two"></div>

                    <div className="sa-privacy-hero-content">
                         <div className="sa-badge">
                              <i className="fa-solid fa-file-contract"></i>
                              Legal Information
                         </div>

                         <h1>
                              Simple rules for using{" "}
                              <span>Spend Analyzer.</span>
                         </h1>

                         <p>
                              These Terms and Conditions explain your rights,
                              responsibilities, and the rules that apply when using
                              Spend Analyzer.
                         </p>

                         <div className="sa-privacy-effective-date">
                              <i className="fa-regular fa-calendar"></i>
                              Effective Date: June 25, 2026
                         </div>
                    </div>
               </section>

               <section className="sa-section sa-privacy-intro-section">
                    <div className="sa-section-head sa-privacy-reveal">
                         <span className="sa-eyebrow">Before You Use The App</span>

                         <h2>Built to help you organize your spending</h2>

                         <p>
                              Spend Analyzer helps you track expenses, review budgets,
                              receive reminders, and understand your spending patterns.
                              Please read these terms carefully before using the
                              platform.
                         </p>
                    </div>
               </section>

               <section className="sa-section sa-privacy-policy-section">
                    <div className="sa-section-head">
                         <span className="sa-eyebrow">Terms & Conditions</span>

                         <h2>Rules, responsibilities, and account use</h2>

                         <p>
                              These sections describe how Spend Analyzer works, what is
                              expected from users, and important limitations of the
                              service.
                         </p>
                    </div>

                    <div className="sa-privacy-policy-list">
                         {termsSections.map((section, index) => (
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
                                   <span>Need help?</span>

                                   <h3>Contact Spend Analyzer</h3>

                                   <p>
                                        For questions about these Terms and Conditions,
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
                         <span className="sa-eyebrow">Key Account Rules</span>

                         <h2>Use Spend Analyzer responsibly</h2>

                         <p>
                              Keep your account secure, add accurate information, and
                              review your own financial records before making decisions.
                         </p>
                    </div>

                    <div className="sa-privacy-security-grid">
                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-key"></i>
                              <h4>Protect Your Login</h4>
                              <p>
                                   Never share your password, OTP, or account access
                                   with anyone else.
                              </p>
                         </div>

                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-pen"></i>
                              <h4>Keep Records Accurate</h4>
                              <p>
                                   Review your expenses, budgets, dates, and reminders
                                   regularly for accuracy.
                              </p>
                         </div>

                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-bell"></i>
                              <h4>Check Important Alerts</h4>
                              <p>
                                   Alerts are helpful reminders, but you remain
                                   responsible for bills and due dates.
                              </p>
                         </div>

                         <div className="sa-privacy-security-item sa-privacy-reveal">
                              <i className="fa-solid fa-user-check"></i>
                              <h4>Use It Lawfully</h4>
                              <p>
                                   Do not misuse the app, attempt unauthorized access,
                                   or interfere with platform security.
                              </p>
                         </div>
                    </div>
               </section>

               <section className="sa-section">
                    <div className="sa-cta">
                         <h2>Ready to manage your spending smarter?</h2>

                         <p>
                              Create your account and begin organizing expenses,
                              budgets, reminders, and reports in one place.
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