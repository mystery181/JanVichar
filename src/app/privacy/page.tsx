"use client";

export default function PrivacyPolicy() {
    return (
        <div className="legal-page">
            <div className="page-header" style={{ backgroundColor: "var(--primary-color)", color: "white", padding: "60px 0", textAlign: "center" }}>
                <div className="container">
                    <h2>Privacy Policy</h2>
                    <p>Effective Date: February 13, 2026</p>
                </div>
            </div>

            <div className="container" style={{ padding: "60px 0", lineHeight: "1.8", color: "#333" }}>
                <div className="pil-card" style={{ padding: "40px" }}>
                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>1. Introduction</h3>
                        <p>
                            JanVichar (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how
                            we collect, use, and protect your information when you use our platform to file or support Public Interest Litigations (PILs).
                        </p>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>2. Information We Collect</h3>
                        <p><strong>Personal Information:</strong> When you log in via Google, we collect your name and email address provided by Google Authentication.</p>
                        <p><strong>PIL Data:</strong> We collect the titles, descriptions, and evidence material you submit when filing a PIL.</p>
                        <p><strong>Interaction Data:</strong> We track which PILs you have upvoted to prevent duplicate voting.</p>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>3. How We Use Your Information</h3>
                        <ul>
                            <li>To provide and maintain the JanVichar platform.</li>
                            <li>To display your name as the creator of a PIL (if you choose to file one).</li>
                            <li>To validate PIL drafts using AI services (Gemini API).</li>
                            <li>To track community support and trending issues.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>4. Data Security</h3>
                        <p>
                            We implement security measures to protect your data. However, please note that filing a PIL is a public-facing
                            action within this platform, and information related to filed PILs is visible to the public.
                        </p>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>5. Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@janvichar.in.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
