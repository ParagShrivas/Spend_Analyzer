import React, { useState, useEffect, useRef } from "react";
import "../css/home.css";
import { useNavigate } from 'react-router-dom';

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FeatureCard({ icon, color, title, desc, delay }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`sa-feature-card ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="sa-feature-icon" style={{ background: color }}>
        {icon}
      </div>

      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function StepItem({ num, title, desc, delay }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`sa-step ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="sa-step-num">{num}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div className="sa-faq-item">
      <div
        className={`sa-faq-q ${isOpen ? "open" : ""}`}
        onClick={onClick}
      >
        {q}

        <i
          className="fa-solid fa-chevron-down"
          style={{ color: "#64748b", fontSize: "20px" }}
        ></i>
      </div>

      <div className={`sa-faq-a ${isOpen ? "open" : ""}`}>
        {a}
      </div>
    </div>
  );
}


export default function SpendAnalyzerLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [modal, setModal] = useState(null);
  const [progressVisible, setProgressVisible] = useState(false);
  const navigate = useNavigate();

  const progressRef = useRef(null);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setMobileOpen(false)
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgressVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: (
        <i
          className="fa-solid fa-receipt"
          style={{ fontSize: "26px" }}
        ></i>
      ),
      color: "linear-gradient(135deg, var(--primary-sky), var(--secondary-sky))",
      title: "Log every expense",
      desc: "Add expenses in seconds with category, date, and notes. Built for daily habit, not occasional cleanup."
    },
    {
      icon: (
        <i
          className="fa-solid fa-file-excel"
          style={{ fontSize: "26px" }}
        ></i>
      ),
      color: "linear-gradient(135deg, var(--purple), #6d28d9)",
      title: "Download CSV history",
      desc: "Export your full expense history as a CSV file anytime, ready for spreadsheets or your accountant."
    },
    {
      icon: (
        <i
          className="fa-solid fa-chart-column"
          style={{ fontSize: "26px" }}
        ></i>
      ),
      color: "linear-gradient(135deg, var(--orange), #ea580c)",
      title: "Visual spend analysis",
      desc: "Interactive charts break spending down by category, month, and trend so patterns are easy to spot."
    },
    {
      icon: (
        <i
          className="fa-solid fa-bell"
          style={{ fontSize: "26px" }}
        ></i>
      ),
      color: "linear-gradient(135deg, var(--red), #b91c1c)",
      title: "Bill alert reminders",
      desc: "Set reminders for recurring bills so due dates never sneak up on you again."
    },
    {
      icon: (
        <i
          className="fa-solid fa-piggy-bank"
          style={{ fontSize: "26px" }}
        ></i>
      ),
      color: "linear-gradient(135deg, var(--green), #059669)",
      title: "Monthly budgets",
      desc: "Set a monthly budget per category and track how close you are to the limit in real time."
    },
    {
      icon: (
        <i
          className="fa-solid fa-shield-halved"
          style={{ fontSize: "26px" }}
        ></i>
      ),
      color: "linear-gradient(135deg, var(--dark-blue), var(--primary-sky))",
      title: "Private by design",
      desc: "Your financial data stays yours. Local-first storage with full control over export and deletion."
    }
  ];

  const steps = [
    {
      title: "Create an account",
      desc: "Sign up in under a minute, no card required."
    },
    {
      title: "Add your expenses",
      desc: "Log purchases as they happen or import in bulk."
    },
    {
      title: "Review your charts",
      desc: "See category and monthly breakdowns instantly."
    },
    {
      title: "Stay on budget",
      desc: "Get alerts before bills and budgets are due."
    }
  ];

  const faqs = [
    {
      q: "Is Spend Analyzer free to use?",
      a: "Yes, Spend Analyzer is completely free to use. You can track expenses, view charts, set budgets, download CSV history, and receive reminders at no cost."
    },
    {
      q: "Can I export my data anytime?",
      a: "Yes, your full expense history can be downloaded as a CSV file at any time from your dashboard."
    },
    {
      q: "How do bill reminders work?",
      a: "Set a due date and frequency for any recurring bill, and we'll send you a reminder ahead of time."
    },
    {
      q: "Is my financial data secure?",
      a: "Your data is encrypted and never sold or shared with third parties. You control export and deletion."
    }
  ];

  return (
    <div className="sa-root">
      {/* NAVBAR */}
      <nav className={`sa-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="sa-logo" onClick={() => navigate('/')}>
          <div className="sa-logo-icon">
            <i className="fa-solid fa-wallet"></i>
          </div>
          Spend Analyzer
        </div>

        <div className="sa-links">
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

      {/* HERO */}
      <section className="sa-hero">
        <div className="sa-bg-blob"></div>

        <div className="sa-hero-content">
          <div className="sa-badge">
            <i className="fa-solid fa-sparkles"></i>
            Know where every rupee goes
          </div>

          <h1>
            Track spending. <span>See clarity.</span> Stay on
            budget.
          </h1>

          <p>
            Spend Analyzer helps you log expenses, visualize
            spending patterns with charts, download your full
            history as CSV, and get reminded before bills are
            due — all in one simple dashboard.
          </p>

          <div className="sa-hero-btns">
            <button type="button" className="sa-btn-primary">
              Get started free
              <i className="fa-solid fa-arrow-right"></i>
            </button>

            <button
              type="button"
              className="sa-btn-secondary"
            >
              See how it works
            </button>
          </div>

        </div>

        <div className="sa-hero-visual">
          <div className="sa-float-badge b1">
            <i
              className="fa-solid fa-arrow-trend-up"
              style={{ color: "var(--green)" }}
            ></i>
            Budget on track
          </div>

          <div className="sa-float-badge b2">
            <i
              className="fa-solid fa-bell"
              style={{ color: "var(--orange)" }}
            ></i>
            Rent due in 3 days
          </div>

          <div className="sa-card-main">
            <div className="sa-card-header">
              <h4>This month's spend</h4>
              <span>-12% vs last month</span>
            </div>

            <div className="sa-bar-row">
              <div
                className="sa-bar"
                style={{ height: "55%" }}
              ></div>
              <div
                className="sa-bar"
                style={{ height: "80%" }}
              ></div>
              <div
                className="sa-bar"
                style={{ height: "40%" }}
              ></div>
              <div
                className="sa-bar"
                style={{ height: "95%" }}
              ></div>
              <div
                className="sa-bar"
                style={{ height: "65%" }}
              ></div>
              <div
                className="sa-bar"
                style={{ height: "30%" }}
              ></div>
            </div>

            <div className="sa-mini-stat">
              <span>Food &amp; dining</span>
              <strong>₹8,420</strong>
            </div>

            <div className="sa-mini-stat">
              <span>Transport</span>
              <strong>₹3,150</strong>
            </div>

            <div className="sa-mini-stat">
              <span>Subscriptions</span>
              <strong>₹1,899</strong>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sa-section" id="features">
        <div className="sa-section-head">
          <span className="sa-eyebrow">
            Everything in one place
          </span>

          <h2>Built to make money tracking effortless</h2>

          <p>
            From quick logging to deep analysis, Spend Analyzer
            covers the full loop of understanding your money.
          </p>
        </div>

        <div className="sa-features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 80}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="sa-section"
        id="how-it-works"
        style={{ paddingTop: 20 }}
      >
        <div className="sa-section-head">
          <span className="sa-eyebrow">Getting started</span>

          <h2>Up and running in four steps</h2>

          <p>
            No spreadsheets, no setup headaches. Just sign up
            and start logging.
          </p>
        </div>

        <div className="sa-steps">
          {steps.map((step, index) => (
            <StepItem
              key={step.title}
              num={index + 1}
              {...step}
              delay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* CSV EXPORT + ANALYSIS */}
      <section className="sa-section" id="analysis">
        <div className="sa-export-wrap">
          <div className="sa-export-text">
            <span
              className="sa-eyebrow"
              style={{ color: "var(--light-sky)" }}
            >
              Your data, your file
            </span>

            <h2>
              Download your full expense history as CSV
            </h2>

            <p>
              Every expense you log is available to export
              anytime. Pull a clean CSV file for your
              spreadsheet, accountant, or your own records —
              no lock-in, ever.
            </p>

            <button type="button" className="sa-btn-white">
              <i className="fa-solid fa-download"></i>
              Download CSV
            </button>
          </div>

          <div className="sa-export-card">
            <div className="sa-csv-row">
              <span>Date</span>
              <span>Category</span>
              <span>Amount</span>
            </div>

            <div className="sa-csv-row">
              <span>12 Jun</span>
              <span>Groceries</span>
              <span>₹1,240</span>
            </div>

            <div className="sa-csv-row">
              <span>14 Jun</span>
              <span>Fuel</span>
              <span>₹980</span>
            </div>

            <div className="sa-csv-row">
              <span>16 Jun</span>
              <span>Streaming</span>
              <span>₹499</span>
            </div>

            <div className="sa-csv-row">
              <span>18 Jun</span>
              <span>Dining</span>
              <span>₹1,650</span>
            </div>
          </div>
        </div>
      </section>

      {/* BUDGET + ALERTS STRIP */}
      <section
        className="sa-section"
        style={{ paddingTop: 20 }}
      >
        <div className="sa-strip">
          <div className="sa-strip-card" ref={progressRef}>
            <i
              className="fa-solid fa-piggy-bank"
              style={{
                color: "var(--green)",
                fontSize: "32px"
              }}
            ></i>

            <h3>Monthly budget tracking</h3>

            <p>
              Set a monthly limit per category and watch your
              progress update as you spend.
            </p>

            <div className="sa-progress-track">
              <div
                className="sa-progress-fill"
                style={{
                  width: progressVisible
                    ? "68%"
                    : "0%"
                }}
              ></div>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "0.85rem"
              }}
            >
              ₹13,600 of ₹20,000 monthly budget used
            </p>
          </div>

          <div className="sa-strip-card">
            <i
              className="fa-solid fa-bell"
              style={{
                color: "var(--orange)",
                fontSize: "32px"
              }}
            ></i>

            <h3>Bill alert reminders</h3>

            <p>
              Never miss a due date with reminders set ahead
              of time.
            </p>

            <div className="sa-alert-pill">
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: "var(--orange)" }}
              ></i>
              Electricity bill due in 2 days
            </div>

            <div
              className="sa-alert-pill"
              style={{
                borderLeftColor: "var(--red)"
              }}
            >
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: "var(--red)" }}
              ></i>
              Credit card payment due tomorrow
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sa-section" id="faq">
        <div className="sa-section-head">
          <span className="sa-eyebrow">Questions</span>
          <h2>Frequently asked questions</h2>
        </div>

        <div className="sa-faq-list">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              isOpen={openFaq === index}
              onClick={() =>
                setOpenFaq(
                  openFaq === index ? -1 : index
                )
              }
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="sa-section"
        style={{ paddingTop: 10 }}
      >
        <div className="sa-cta">
          <h2>Start understanding your money today</h2>

          <p>
            Free to join. Add your first expense in under a
            minute.
          </p>

          <button
            type="button"
            className="sa-btn-primary"
            style={{ margin: "0 auto" }}
          >
            Create free account
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* FOOTER */}
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
            <a onClick={() => setModal("privacy")}>
              Privacy policy
            </a>
            <a onClick={() => setModal("terms")}>
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

      {/* MODALS */}
      {modal && (
        <div
          className="sa-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="sa-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="sa-modal-close"
              onClick={() => setModal(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {modal === "privacy" ? (
              <>
                <h3>Privacy policy</h3>
                <p>
                  Spend Analyzer collects only the
                  information needed to provide expense
                  tracking, budgeting, and reminder
                  features, such as the expenses you
                  log and your account details.
                </p>
                <p>
                  Your financial data is never sold to
                  third parties. CSV exports are
                  generated on demand and only
                  accessible to you.
                </p>
                <p>
                  You may request deletion of your
                  account and all associated data at
                  any time from your account settings.
                </p>
              </>
            ) : (
              <>
                <h3>Terms of service</h3>
                <p>
                  By using Spend Analyzer, you agree
                  to use the service for personal
                  expense tracking in accordance with
                  applicable law.
                </p>
                <p>
                  You are responsible for the accuracy
                  of expenses you log. Spend Analyzer
                  is a tracking tool and does not
                  provide financial, tax, or investment
                  advice.
                </p>
                <p>
                  We may update these terms from time
                  to time. Continued use of the service
                  after updates constitutes acceptance
                  of the revised terms.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}