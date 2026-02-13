"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function CreatePIL() {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [evidence, setEvidence] = useState("");
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState("");
    const [validating, setValidating] = useState(false);

    const validatePIL = async () => {
        if (!title || !description) return;
        setValidating(true);
        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Validate this PIL for completeness and suggest improvements:
      Title: ${title}
      Description: ${description}
      Evidence: ${evidence}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            setValidation(response.text());
        } catch (error) {
            console.error("Validation failed", error);
            setValidation("Could not validate at this time. Please proceed manually.");
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "pils"), {
                title,
                description,
                evidence,
                createdBy: user.uid,
                creatorName: user.displayName,
                createdAt: serverTimestamp(),
                supporters: 0,
                upvotedBy: []
            });
            router.push(`/pil/${docRef.id}`);
        } catch (error) {
            console.error("Error creating PIL", error);
            alert("Failed to create PIL. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
                <h2>Please login to file a PIL</h2>
                <button onClick={() => router.push("/login")} className="btn-primary">Go to Login</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: "40px 0" }}>
            <div className="pil-card" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
                <h2>File a New Public Interest Litigation</h2>
                <p>Please provide accurate details. Each PIL should address a single public issue.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Cleaning the Yamuna River"
                            required
                            style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #ddd" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description of the issue and why it matters to the public..."
                            required
                            rows={6}
                            style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #ddd", fontFamily: "inherit" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Evidence / External Links</label>
                        <textarea
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            placeholder="Links to news articles, reports, or description of physical evidence..."
                            rows={3}
                            style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #ddd", fontFamily: "inherit" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                        <button
                            type="button"
                            onClick={validatePIL}
                            className="btn-secondary"
                            disabled={validating || !title || !description}
                        >
                            {validating ? "Validating..." : "AI Validate Draft"}
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Filing PIL..." : "Submit PIL"}
                        </button>
                    </div>
                </form>

                {validation && (
                    <div style={{ backgroundColor: "#fdf8e6", padding: "20px", borderRadius: "8px", border: "1px solid #e1c06d" }}>
                        <h4 style={{ color: "var(--primary-color)", marginTop: 0 }}>AI Feedback</h4>
                        <div style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>{validation}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
