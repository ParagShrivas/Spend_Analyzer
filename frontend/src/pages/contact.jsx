import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Toast from "../components/toast";
import "../css/contact.css";

const API_URL = "https://spend-analyzer-five.vercel.app/contact";

export default function Contact() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastMessageType, setToastMessageType] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.subject.trim() ||
            !formData.message.trim()
        ) {
            setShowToast(true);
            setToastMessage("Please fill in all fields.");
            setToastMessageType("error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to send your message."
                );
            }

            setShowToast(true);
            setToastMessage(
                `Thank you, ${formData.name.trim()}! Message sent successfully. We will reply by email.`
            );
            setToastMessageType("success");

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            setShowToast(true);
            setToastMessage(
                error.message ||
                "Unable to send your message. Please try again."
            );
            setToastMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sa-root">
            <Navbar />

            <Toast
                type={toastMessageType}
                message={toastMessage}
                show={showToast}
                setShow={setShowToast}
            />

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

                    <span className="sa-breadcrumb-current">
                        Contact Us
                    </span>
                </nav>
            </div>

            <section className="sa-contact-hero">
                <div className="sa-contact-hero-content">
                    <span className="sa-eyebrow">Contact Us</span>

                    <h1>
                        Let&apos;s make your money management{" "}
                        <span>simpler.</span>
                    </h1>

                    <p>
                        Have a question, feedback, or need help with your
                        Spend Analyzer account? Send us a message and our
                        team will get back to you by email.
                    </p>
                </div>

                <div className="sa-contact-hero-icon">
                    <div className="sa-contact-glow"></div>

                    <div className="sa-contact-envelope">
                        <i className="fa-solid fa-envelope-open-text"></i>
                    </div>

                    <div className="sa-contact-float-card">
                        <i className="fa-solid fa-shield-halved"></i>
                        Secure support
                    </div>
                </div>
            </section>

            <section className="sa-section sa-contact-section">
                <div className="sa-contact-layout">
                    <div className="sa-contact-info">
                        <span className="sa-eyebrow">Support</span>

                        <h2>We&apos;re here to help</h2>

                        <p>
                            Reach out for account support, general
                            questions, product feedback, or help using
                            Spend Analyzer.
                        </p>

                        <div className="sa-contact-email-card">
                            <div className="sa-contact-email-icon">
                                <i className="fa-solid fa-envelope"></i>
                            </div>

                            <div>
                                <span>Email us anytime</span>

                                <a href="mailto:contact@domain.com">
                                    contact@domain.com
                                </a>
                            </div>
                        </div>

                        <div className="sa-contact-note">
                            <i className="fa-solid fa-circle-info"></i>

                            <p>
                                For account security, never share your
                                password or OTP code in a message.
                            </p>
                        </div>
                    </div>

                    <form
                        className="sa-contact-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="sa-contact-form-head">
                            <div className="sa-contact-form-icon">
                                <i className="fa-solid fa-paper-plane"></i>
                            </div>

                            <div>
                                <h2>Send a message</h2>

                                <p>
                                    Fill in the form and we will reply
                                    by email.
                                </p>
                            </div>
                        </div>

                        <div className="sa-contact-field-row">
                            <div className="sa-contact-field">
                                <label htmlFor="name">Your name</label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="sa-contact-field">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="sa-contact-field">
                            <label htmlFor="subject">Subject</label>

                            <input
                                id="subject"
                                type="text"
                                name="subject"
                                placeholder="What can we help you with?"
                                value={formData.subject}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="sa-contact-field">
                            <label htmlFor="message">Your message</label>

                            <textarea
                                id="message"
                                name="message"
                                placeholder="Write your message here..."
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                disabled={loading}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="sa-btn-primary sa-contact-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Sending...
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <i className="fa-solid fa-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}