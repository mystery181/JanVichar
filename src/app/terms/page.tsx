"use client";

export default function TermsOfService() {
    return (
        <div className="legal-page">
            <div className="page-header" style={{ backgroundColor: "var(--primary-color)", color: "white", padding: "60px 0", textAlign: "center" }}>
                <div className="container">
                    <h2>Terms of Service</h2>
                    <p>Effective Date: February 13, 2026</p>
                </div>
            </div>

            <div className="container" style={{ padding: "60px 0", lineHeight: "1.8", color: "#333" }}>
                <div className="pil-card" style={{ padding: "40px" }}>
                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>1. Acceptance of Terms</h3>
                        <p>
                            By accessing or using JanVichar, you agree to be bound by these Terms of Service. If you do not agree,
                            please do not use the platform.
                        </p>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>2. Purpose of the Platform</h3>
                        <p>
                            JanVichar is a tool for legal empowerment and civic engagement. It allows users to draft Public Interest
                            Litigations (PILs) and collect community support. **This platform does not provide professional legal
                            advice.** All drafts should be reviewed by a qualified legal professional before submission to any court.
                        </p>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>3. User Conduct</h3>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Submit false, misleading, or defamatory content.</li>
                            <li>Use the platform for any illegal or unauthorized purpose.</li>
                            <li>Attempt to gain unauthorized access to the admin portal or other user accounts.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>4. Intellectual Property</h3>
                        <p>
                            The content you submit remains yours, but you grant JanVichar a license to display and share this content
                            within the platform for the purpose of community engagement and support gathering.
                        </p>
                    </section>

                    <section style={{ marginBottom: "30px" }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "15px" }}>5. Limitation of Liability</h3>
                        <p>
                            JanVichar and its developers are not liable for any legal consequences arising from the use of PIL drafts
                            generated on this platform. The responsibility for the accuracy and legal validity of any submission
                            rests solely with the user.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
