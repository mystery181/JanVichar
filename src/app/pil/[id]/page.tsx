"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import jsPDF from "jspdf";
import { Share2, ThumbsUp, FileText, Download, ArrowLeft } from "lucide-react";

interface PIL {
    id: string;
    title: string;
    description: string;
    evidence: string;
    supporters: number;
    createdAt: any;
    createdBy: string;
    creatorName?: string;
    upvotedBy?: string[];
}

export default function PILDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [pil, setPil] = useState<PIL | null>(null);
    const [loading, setLoading] = useState(true);
    const [upvoted, setUpvoted] = useState(false);
    const [upvoting, setUpvoting] = useState(false);

    useEffect(() => {
        const fetchPIL = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "pils", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as PIL;
                    setPil({ ...data, id: docSnap.id });
                    if (user && data.upvotedBy?.includes(user.uid)) {
                        setUpvoted(true);
                    }
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching PIL", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPIL();
    }, [id, user]);

    const handleUpvote = async () => {
        if (!user) {
            alert("Please login to upvote.");
            return;
        }
        if (upvoted || upvoting) return;

        setUpvoting(true);
        try {
            const docRef = doc(db, "pils", id as string);
            await updateDoc(docRef, {
                supporters: increment(1),
                upvotedBy: arrayUnion(user.uid)
            });
            setPil(prev => prev ? { ...prev, supporters: prev.supporters + 1 } : null);
            setUpvoted(true);
        } catch (error) {
            console.error("Error upvoting", error);
        } finally {
            setUpvoting(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: pil?.title,
                text: `Support this PIL on JanVichar: ${pil?.title}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const exportPDF = () => {
        if (!pil) return;
        const doc = new jsPDF();

        // Design and styling for PDF
        doc.setFillColor(128, 0, 0); // Maroon
        doc.rect(0, 0, 210, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("JanVichar - PIL Draft", 20, 25);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(pil.title, 20, 60);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Filed on: ${pil.createdAt ? new Date(pil.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}`, 20, 70);
        doc.text(`Supporters: ${pil.supporters}`, 20, 77);

        doc.line(20, 85, 190, 85);

        doc.setFont("helvetica", "bold");
        doc.text("Description:", 20, 100);
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(pil.description, 170);
        doc.text(splitDesc, 20, 110);

        let currentY = 110 + (splitDesc.length * 7);

        if (pil.evidence) {
            doc.setFont("helvetica", "bold");
            doc.text("Evidence / Links:", 20, currentY + 10);
            doc.setFont("helvetica", "normal");
            const splitEvidence = doc.splitTextToSize(pil.evidence, 170);
            doc.text(splitEvidence, 20, currentY + 20);
        }

        doc.save(`PIL_${id}.pdf`);
    };

    if (loading) return <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>Loading...</div>;
    if (!pil) return <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>PIL not found.</div>;

    return (
        <div className="container" style={{ padding: "40px 0" }}>
            <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", marginBottom: "20px", fontWeight: "bold" }}>
                <ArrowLeft size={18} /> Back to Tracker
            </button>

            <div className="pil-card" style={{ padding: "40px", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <div className="pil-status status-filed" style={{ display: "inline-block", marginBottom: "15px" }}>Active</div>
                        <h2 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "var(--primary-color)" }}>{pil.title}</h2>
                        <p style={{ color: "#666", marginBottom: "20px" }}>
                            Filed on {pil.createdAt ? new Date(pil.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                            {pil.creatorName && ` by ${pil.creatorName}`}
                        </p>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        <button
                            onClick={handleUpvote}
                            className={upvoted ? "btn-secondary" : "btn-primary"}
                            disabled={upvoted || upvoting}
                            style={{ display: "flex", alignItems: "center", gap: "8px", opacity: upvoted ? 0.7 : 1 }}
                        >
                            <ThumbsUp size={18} /> {upvoted ? "Supported" : "Support this PIL"} ({pil.supporters})
                        </button>
                        <button onClick={handleShare} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Share2 size={18} /> Share
                        </button>
                        <button onClick={exportPDF} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#333", color: "white" }}>
                            <Download size={18} /> PDF
                        </button>
                    </div>
                </div>

                <hr style={{ margin: "30px 0", border: "0", borderTop: "1px solid #eee" }} />

                <div style={{ marginBottom: "40px" }}>
                    <h3 style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText size={22} color="var(--primary-color)" /> Description
                    </h3>
                    <div style={{ lineHeight: "1.8", fontSize: "1.1rem", whiteSpace: "pre-wrap" }}>
                        {pil.description}
                    </div>
                </div>

                {pil.evidence && (
                    <div>
                        <h3 style={{ marginBottom: "15px" }}>Evidence / External Links</h3>
                        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", fontStyle: "italic" }}>
                            {pil.evidence}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: "40px", padding: "30px", backgroundColor: "#fff5f5", borderRadius: "10px", border: "1px solid #fed7d7" }}>
                <h4 style={{ color: "#c53030", marginTop: 0 }}>Legal Disclaimer</h4>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    The content of this Public Interest Litigation (PIL) draft is generated by a citizen and is intended for informational and community-building purposes. It does not constitute legal advice or an official court filing. For actual legal proceedings, please consult a qualified legal professional or follow the official procedures of the relevant courts in India.
                </p>
            </div>
        </div>
    );
}
