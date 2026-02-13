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

const ADMIN_EMAIL = "tejusjaiswal13@gmail.com"; // Assuming this is the owner's email based on the repo name

export default function AdminPortal() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [pils, setPils] = useState<PIL[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.email !== ADMIN_EMAIL) {
                router.push("/"); // Redirect if not admin
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
        }
    }, [user, authLoading, router]);

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
                <div style={{ backgroundColor: "#fde8e8", padding: "10px 20px", borderRadius: "20px", color: "var(--primary-color)", fontWeight: "bold" }}>
                    Admin Mode Active
                </div>
            </div>

            <div className="pil-card" style={{ padding: "0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead style={{ backgroundColor: "var(--primary-color)", color: "white" }}>
                        <tr>
                            <th style={{ padding: "15px" }}>Title</th>
                            <th style={{ padding: "15px" }}>Creator</th>
                            <th style={{ padding: "15px" }}>Supporters</th>
                            <th style={{ padding: "15px" }}>Status</th>
                            <th style={{ padding: "15px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pils.map((pil) => (
                            <tr key={pil.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "15px" }}>
                                    <div style={{ fontWeight: "bold" }}>{pil.title}</div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{pil.id}</div>
                                </td>
                                <td style={{ padding: "15px" }}>{pil.creatorName || "Anonymous"}</td>
                                <td style={{ padding: "15px" }}>{pil.supporters}</td>
                                <td style={{ padding: "15px" }}>
                                    <select
                                        value={pil.status || "Filed"}
                                        onChange={(e) => updateStatus(pil.id, e.target.value)}
                                        style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                                    >
                                        <option value="Filed">Filed</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Admitted">Admitted</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Success">Success</option>
                                    </select>
                                </td>
                                <td style={{ padding: "15px" }}>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button
                                            onClick={() => router.push(`/pil/${pil.id}`)}
                                            title="View PIL"
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pil.id)}
                                            title="Delete PIL"
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#c53030" }}
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
