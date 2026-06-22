import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../css/about.css";

export default function About() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const revealItems = document.querySelectorAll(".sa-about-reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealItems.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="sa-root">
            <Navbar />

            <div className="sa-breadcrumb-wrap">
                <nav className="sa-breadcrumb" aria-label="Breadcrumb">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="sa-breadcrumb-home"
                    >
                        <i className="fa-solid fa-house"></i>
                        Home
                    </button>

                    <i className="fa-solid fa-chevron-right sa-breadcrumb-arrow"></i>

                    <span className="sa-breadcrumb-current">About Us</span>
                </nav>
            </div>

            <section className="sa-about-hero">
                <div className="sa-about-hero-content">
                    <div className="sa-badge">
                        <i className="fa-solid fa-wallet"></i>
                        About Spend Analyzer
                    </div>

                    <h1>
                        Smarter money habits start with{" "}
                        <span>clear spending insights.</span>
                    </h1>

                    <p>
                        Spend Analyzer is designed to help users track
                        expenses, understand spending patterns, manage
                        budgets, and stay ahead of important reminders and
                        bill alerts.
                    </p>

                    <div className="sa-hero-btns">
                        <button
                            type="button"
                            className="sa-btn-primary"
                            onClick={() => navigate("/register")}
                        >
                            Start Tracking
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>

                        <button
                            type="button"
                            className="sa-btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                <div className="sa-about-visual">
                    <div className="sa-bg-blob"></div>

                    <div className="sa-about-card">
                        <div className="sa-about-card-top">
                            <div>
                                <span>Monthly Overview</span>
                                <h3>₹24,850</h3>
                            </div>

                            <div className="sa-about-icon">
                                <i className="fa-solid fa-chart-line"></i>
                            </div>
                        </div>

                        <div className="sa-about-meter">
                            <div style={{ width: "76%" }}></div>
                        </div>

                        <div className="sa-about-mini-list">
                            <div>
                                <span>Food</span>
                                <strong>₹6,200</strong>
                            </div>

                            <div>
                                <span>Bills</span>
                                <strong>₹8,400</strong>
                            </div>

                            <div>
                                <span>Savings</span>
                                <strong>₹10,250</strong>
                            </div>
                        </div>
                    </div>

                    <div className="sa-float-badge b1">
                        <i className="fa-solid fa-bell"></i>
                        Bill alert ready
                    </div>

                    <div className="sa-float-badge b2">
                        <i className="fa-solid fa-shield-halved"></i>
                        OTP secured
                    </div>
                </div>
            </section>

            <section className="sa-section">
                <div className="sa-section-head">
                    <span className="sa-eyebrow">Who We Are</span>
                    <h2>Built for simple and stress-free expense tracking</h2>
                    <p>
                        Our goal is to make personal finance easier for
                        everyday users by combining expense records,
                        visual analytics, reminders, and secure account
                        access in one clean dashboard.
                    </p>
                </div>

                <div className="sa-about-info-grid">
                    <div className="sa-about-info-card sa-about-reveal">
                        <div className="sa-feature-icon bg-sky">
                            <i className="fa-solid fa-bullseye"></i>
                        </div>

                        <h3>Our Mission</h3>

                        <p>
                            To help users record expenses, understand
                            where their money goes, and make better daily
                            financial decisions through simple tools and
                            clear insights.
                        </p>
                    </div>

                    <div className="sa-about-info-card sa-about-reveal">
                        <div className="sa-feature-icon bg-purple">
                            <i className="fa-solid fa-eye"></i>
                        </div>

                        <h3>Our Vision</h3>

                        <p>
                            To become a reliable personal finance
                            assistant that helps users stay organized,
                            reduce missed payments, and build smarter
                            money habits over time.
                        </p>
                    </div>

                    <div className="sa-about-info-card sa-about-reveal">
                        <div className="sa-feature-icon bg-green">
                            <i className="fa-solid fa-heart"></i>
                        </div>

                        <h3>Our Values</h3>

                        <p>
                            We focus on simplicity, privacy, security,
                            clarity, and user-first design so financial
                            tracking feels easy instead of complicated.
                        </p>
                    </div>
                </div>
            </section>

            <section className="sa-section sa-about-dark">
                <div className="sa-section-head">
                    <span className="sa-eyebrow">Why Spend Analyzer</span>
                    <h2>Everything you need to understand your spending</h2>
                    <p>
                        From OTP-secured login to automated bill alerts,
                        Spend Analyzer gives users the right tools to
                        manage money with confidence.
                    </p>
                </div>

                <div className="sa-about-benefits">
                    <div className="sa-about-benefit sa-about-reveal">
                        <i className="fa-solid fa-chart-pie"></i>
                        <h4>Visual Reports</h4>
                        <p>
                            View category-wise expenses and monthly
                            trends using clean charts and summaries.
                        </p>
                    </div>

                    <div className="sa-about-benefit sa-about-reveal">
                        <i className="fa-solid fa-bell"></i>
                        <h4>Smart Alerts</h4>
                        <p>
                            Create reminders and bill alerts so important
                            payments and tasks are not missed.
                        </p>
                    </div>

                    <div className="sa-about-benefit sa-about-reveal">
                        <i className="fa-solid fa-file-export"></i>
                        <h4>Exportable Data</h4>
                        <p>
                            Keep your spending history available and ready
                            to export whenever needed.
                        </p>
                    </div>

                    <div className="sa-about-benefit sa-about-reveal">
                        <i className="fa-solid fa-lock"></i>
                        <h4>Secure Access</h4>
                        <p>
                            Login OTP, password reset OTP, hashed
                            passwords, and secure cookies protect user
                            accounts.
                        </p>
                    </div>
                </div>
            </section>

            <section className="sa-section">
                <div className="sa-about-stats">
                    <div className="sa-about-stat sa-about-reveal">
                        <strong>100%</strong>
                        <span>Personal expense control</span>
                    </div>

                    <div className="sa-about-stat sa-about-reveal">
                        <strong>24/7</strong>
                        <span>Dashboard access</span>
                    </div>

                    <div className="sa-about-stat sa-about-reveal">
                        <strong>10 Min</strong>
                        <span>OTP expiry security</span>
                    </div>

                    <div className="sa-about-stat sa-about-reveal">
                        <strong>CSV</strong>
                        <span>Export ready records</span>
                    </div>
                </div>
            </section>

            <section className="sa-section">
                <div className="sa-cta">
                    <h2>Ready to manage your money smarter?</h2>

                    <p>
                        Create your account, add your first expense, and
                        start understanding your spending with Spend
                        Analyzer.
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