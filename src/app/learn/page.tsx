"use client";

import React from "react";

export default function Learn() {
    return (
        <div className="learn-page">
            <div className="page-header" style={{ backgroundColor: "var(--primary-color)", color: "white", padding: "60px 0", textAlign: "center" }}>
                <div className="container">
                    <h2>Understanding Public Interest Litigation</h2>
                    <p>A comprehensive guide to your rights, procedures, and the power of PIL in India.</p>
                </div>
            </div>

            <div className="container" style={{ paddingTop: "40px" }}>
                {/* What is PIL */}
                <section className="pil-card" style={{ marginBottom: "30px", padding: "40px" }}>
                    <h3 style={{ color: "var(--primary-color)", borderBottom: "2px solid #fde8e8", paddingBottom: "10px", display: "inline-block", marginBottom: "20px" }}>What is a PIL?</h3>
                    <p>Public Interest Litigation (PIL) is a legal mechanism that allows any citizen or organization to approach the court for potential solutions to issues that affect the public at large. Unlike traditional litigation, where the petitioner must have a personal interest or grievance, a PIL can be filed by any socially conscious person on behalf of the oppressed or for the greater good.</p>
                    <p>It was introduced by Justice P.N. Bhagwati in the early 1980s to make justice accessible to the poor and marginalized.</p>
                </section>

                {/* Constitutional Provisions */}
                <section className="pil-card" style={{ marginBottom: "30px", padding: "40px" }}>
                    <h3 style={{ color: "var(--primary-color)", borderBottom: "2px solid #fde8e8", paddingBottom: "10px", display: "inline-block", marginBottom: "20px" }}>Constitutional Provisions</h3>
                    <p>The concept of PIL is grounded in the Constitution of India, primarily deriving its power from two key articles:</p>

                    <div style={{ backgroundColor: "#fafafa", border: "1px solid #eee", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                        <strong>Article 32 (Supreme Court)</strong>
                        <p>Grants the right to move the Supreme Court for the enforcement of Fundamental Rights. It is considered the "heart and soul" of the Constitution.</p>
                    </div>

                    <div style={{ backgroundColor: "#fafafa", border: "1px solid #eee", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                        <strong>Article 226 (High Courts)</strong>
                        <p>Empowers High Courts to issue writs for the enforcement of Fundamental Rights and for "any other purpose," making its scope wider than Article 32.</p>
                    </div>

                    <div style={{ backgroundColor: "#fdf8e6", borderLeft: "4px solid var(--primary-color)", padding: "20px", borderRadius: "4px" }}>
                        <h4 style={{ color: "var(--primary-color)", marginBottom: "10px" }}>Key Matters for PIL</h4>
                        <p>Bonded Labor, Neglected Children, Non-payment of minimum wages, Petitions against police, Environmental pollution, Adulteration of food, Maintenance of heritage and culture, etc.</p>
                    </div>
                </section>

                {/* Who Can File */}
                <section className="pil-card" style={{ marginBottom: "30px", padding: "40px" }}>
                    <h3 style={{ color: "var(--primary-color)", borderBottom: "2px solid #fde8e8", paddingBottom: "10px", display: "inline-block", marginBottom: "20px" }}>Who Can File a PIL?</h3>
                    <p>Any citizen of India can file a PIL. The only condition is that it should be filed in <strong>public interest</strong> and not for private gain, political motivation, or publicity.</p>
                    <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                        <li style={{ position: "relative", paddingLeft: "25px", marginBottom: "10px" }}>
                            <span style={{ position: "absolute", left: 0, color: "var(--primary-color)", fontWeight: "bold" }}>✔</span> Any citizen or registered NGO.
                        </li>
                        <li style={{ position: "relative", paddingLeft: "25px", marginBottom: "10px" }}>
                            <span style={{ position: "absolute", left: 0, color: "var(--primary-color)", fontWeight: "bold" }}>✔</span> The Court can also take Suo Moto cognizance (act on its own) based on media reports or letters.
                        </li>
                        <li style={{ position: "relative", paddingLeft: "25px", marginBottom: "10px" }}>
                            <span style={{ position: "absolute", left: 0, color: "var(--primary-color)", fontWeight: "bold" }}>✔</span> The petitioner need not be the aggrieved person.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
