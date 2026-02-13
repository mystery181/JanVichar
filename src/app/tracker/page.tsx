"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import Link from "next/link";

interface PIL {
    id: string;
    title: string;
    description: string;
    supporters: number;
    createdAt: any;
    creatorName?: string;
}

export default function Tracker() {
    const [pils, setPils] = useState<PIL[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        let q;
        if (sortBy === "trending" || sortBy === "most_upvoted") {
            q = query(collection(db, "pils"), orderBy("supporters", "desc"), limit(50));
        } else if (sortBy === "hot") {
            // Simplification for hot: sort by supporters then date
            q = query(collection(db, "pils"), orderBy("supporters", "desc"), orderBy("createdAt", "desc"), limit(50));
        } else {
            q = query(collection(db, "pils"), orderBy("createdAt", "desc"), limit(50));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pilsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as PIL[];
            setPils(pilsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sortBy]);

    return (
        <div className="container" style={{ padding: "40px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2>PIL Tracker</h2>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span>Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="trending">Trending (Most Supporters)</option>
                        <option value="hot">Hot (Recently Active)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>Loading PILs...</div>
            ) : (
                <div className="pils-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                    {pils.length > 0 ? (
                        pils.map((pil) => (
                            <div key={pil.id} className="pil-card">
                                <div className="pil-status status-filed">Active</div>
                                <h4>{pil.title}</h4>
                                <p className="pil-desc">
                                    {pil.description.substring(0, 150)}
                                    {pil.description.length > 150 ? "..." : ""}
                                </p>
                                <div style={{ margin: "15px 0", fontSize: "0.9rem", color: "#666" }}>
                                    <strong>Supporters:</strong> {pil.supporters || 0}
                                </div>
                                <div className="pil-meta">
                                    <span style={{ fontSize: "0.8rem" }}>
                                        {pil.createdAt ? new Date(pil.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                                    </span>
                                    <Link href={`/pil/${pil.id}`} className="btn-text">
                                        View Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px" }}>
                            No PILs found. Be the first to file one!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
