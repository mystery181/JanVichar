"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    return (
        <div className="container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div className="pil-card" style={{ maxWidth: "400px", width: "100%", padding: "40px", textAlign: "center" }}>
                <img src="/logo.png" alt="JanVichar Logo" style={{ width: "80px", marginBottom: "20px" }} />
                <h2>Welcome to JanVichar</h2>
                <p style={{ marginBottom: "30px" }}>Sign in to create and manage Public Interest Litigations.</p>
                <button onClick={login} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "20px" }} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
