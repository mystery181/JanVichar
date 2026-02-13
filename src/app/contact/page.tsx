"use client";

import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Contact() {
    return (
        <div className="contact-page">
            <div className="page-header" style={{ backgroundColor: "var(--primary-color)", color: "white", padding: "60px 0", textAlign: "center" }}>
                <div className="container">
                    <h2>Contact Us</h2>
                    <p>We are here to help you with your legal empowerment journey.</p>
                </div>
            </div>

            <div className="container" style={{ padding: "60px 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
                    <div>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "20px" }}>Get in Touch</h3>
                        <p style={{ marginBottom: "30px", color: "#666", lineHeight: "1.6" }}>
                            Have questions about JanVichar or need assistance with filing a PIL?
                            Reach out to our team of legal volunteers and technical support.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{ backgroundColor: "var(--secondary-color)", padding: "10px", borderRadius: "50%", color: "var(--primary-color)" }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: "700" }}>Email</div>
                                    <div style={{ color: "#666" }}>support@janvichar.in</div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{ backgroundColor: "var(--secondary-color)", padding: "10px", borderRadius: "50%", color: "var(--primary-color)" }}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: "700" }}>Phone</div>
                                    <div style={{ color: "#666" }}>+91 98765 43210</div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{ backgroundColor: "var(--secondary-color)", padding: "10px", borderRadius: "50%", color: "var(--primary-color)" }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: "700" }}>Office</div>
                                    <div style={{ color: "#666" }}>Legal Empowerment Center, New Delhi, India</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pil-card" style={{ padding: "30px" }}>
                        <h3 style={{ marginBottom: "20px" }}>Send a Message</h3>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you soon."); }}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Your Name</label>
                                <input type="text" placeholder="Enter your name" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} required />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Email Address</label>
                                <input type="email" placeholder="Enter your email" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} required />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Message</label>
                                <textarea rows={4} placeholder="How can we help you?" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }} required></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: "100%", cursor: "pointer" }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
