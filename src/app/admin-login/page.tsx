"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Redirect if already logged in as admin
    useEffect(() => {
        const isAdmin = localStorage.getItem("jv_admin_session") === "true";
        if (isAdmin) {
            router.push("/admin-jv-portal");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple ID/Pass check for Hackathon demo
        // You can also move these to environment variables
        const VALID_ID = "admin";
        const VALID_PASS = "janvichar2026";

        if (adminId === VALID_ID && password === VALID_PASS) {
            localStorage.setItem("jv_admin_session", "true");
            router.push("/admin-jv-portal");
        } else {
            setError("Invalid Administrative Credentials");
        }
    };

    return (
        <div className="container" style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="pil-card" style={{ maxWidth: "400px", width: "100%", padding: "40px", textAlign: "center" }}>
                <div style={{ backgroundColor: "var(--secondary-color)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 20px", color: "var(--primary-color)" }}>
                    <Lock size={30} />
                </div>
                <h2 style={{ color: "var(--primary-color)", marginBottom: "10px" }}>Admin Access</h2>
                <p style={{ color: "#666", marginBottom: "30px", fontSize: "0.9rem" }}>Please enter your administrative credentials to continue.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "15px", textAlign: "left" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: "600" }}>Admin ID</label>
                        <div style={{ position: "relative" }}>
                            <User size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                            <input
                                type="text"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                placeholder="Enter ID"
                                style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: "600" }}>Secret Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                                required
                            />
                        </div>
                    </div>

                    {error && <div style={{ color: "#c53030", fontSize: "0.85rem", marginBottom: "20px", fontWeight: "600" }}>{error}</div>}

                    <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", cursor: "pointer" }}>
                        Login to Portal
                    </button>
                </form>
            </div>
        </div>
    );
}
