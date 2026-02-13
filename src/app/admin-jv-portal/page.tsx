"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2, Edit, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface PIL {
    id: string;
    title: string;
    description: string;
    supporters: number;
    createdAt: any;
    creatorName?: string;
    status?: string;
}

export default function AdminPortal() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [pils, setPils] = useState<PIL[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isAdmin = localStorage.getItem("jv_admin_session") === "true";
        if (!isAdmin) {
            router.push("/admin-login");
            return;
        }

        // Fetch all PILs for admin
        const q = query(collection(db, "pils"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pilsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as PIL[];
            setPils(pilsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleAdminLogout = () => {
        localStorage.removeItem("jv_admin_session");
        router.push("/");
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this PIL? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "pils", id));
            } catch (error) {
                console.error("Error deleting PIL", error);
                alert("Failed to delete PIL.");
            }
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await updateDoc(doc(db, "pils", id), { status });
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status.");
        }
    };

    if (authLoading || loading) return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading Admin Portal...</div>;

    return (
        <div className="container" style={{ padding: "40px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h2 style={{ color: "var(--primary-color)" }}>JanVichar Secret Admin Portal</h2>
                    <p>Full control over all filed PILs</p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ backgroundColor: "#fde8e8", padding: "10px 20px", borderRadius: "20px", color: "var(--primary-color)", fontWeight: "bold" }}>
                        Admin Mode Active
                    </div>
                    <button
                        onClick={handleAdminLogout}
                        style={{ background: "#333", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "600" }}
                    >
                        Logout Admin
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden", border: "1px solid #eee" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead style={{ backgroundColor: "#800000", color: "white" }}>
                        <tr>
                            <th style={{ padding: "15px", borderBottom: "1px solid #eee" }}>Title</th>
                            <th style={{ padding: "15px", borderBottom: "1px solid #eee" }}>Creator</th>
                            <th style={{ padding: "15px", borderBottom: "1px solid #eee" }}>Supporters</th>
                            <th style={{ padding: "15px", borderBottom: "1px solid #eee" }}>Status</th>
                            <th style={{ padding: "15px", borderBottom: "1px solid #eee" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pils.map((pil) => (
                            <tr key={pil.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }}>
                                <td style={{ padding: "15px" }}>
                                    <div style={{ fontWeight: "700", color: "#333", marginBottom: "4px" }}>{pil.title}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#999", fontFamily: "monospace" }}>ID: {pil.id}</div>
                                </td>
                                <td style={{ padding: "15px", color: "#555" }}>{pil.creatorName || "Anonymous"}</td>
                                <td style={{ padding: "15px", textAlign: "center" }}>
                                    <span style={{ backgroundColor: "#f0f0f0", padding: "4px 10px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600" }}>
                                        {pil.supporters}
                                    </span>
                                </td>
                                <td style={{ padding: "15px" }}>
                                    <select
                                        value={pil.status || "Filed"}
                                        onChange={(e) => updateStatus(pil.id, e.target.value)}
                                        style={{
                                            padding: "8px",
                                            borderRadius: "6px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#fff",
                                            cursor: "pointer",
                                            width: "100%",
                                            fontSize: "0.9rem"
                                        }}
                                    >
                                        <option value="Filed">Filed</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Admitted">Admitted</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Success">Success</option>
                                    </select>
                                </td>
                                <td style={{ padding: "15px" }}>
                                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                                        <button
                                            onClick={() => router.push(`/pil/${pil.id}`)}
                                            title="View PIL"
                                            style={{ background: "#f0f0f0", border: "none", cursor: "pointer", color: "#555", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center" }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pil.id)}
                                            title="Delete PIL"
                                            style={{ background: "#fee2e2", border: "none", cursor: "pointer", color: "#c53030", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center" }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pils.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                        No PILs found in the database.
                    </div>
                )}
            </div>

            <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#fff5f5", borderRadius: "10px", border: "1px solid #fed7d7" }}>
                <h4 style={{ color: "#c53030", marginTop: 0 }}>Admin Responsibility</h4>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    You have full power to delete and modify records. Use this authority carefully as actions in this portal directly affect the live database and public displays.
                </p>
            </div>
        </div>
    );
}
