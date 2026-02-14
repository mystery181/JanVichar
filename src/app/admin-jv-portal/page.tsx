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
    hearingResult?: string;
    hearingDate?: string;
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

    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full" />
                <p className="font-bold text-muted-foreground animate-pulse">Loading Admin Portal...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-border">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary">JanVichar Admin Portal</h2>
                    <p className="text-muted-foreground font-medium mt-1">Manage filed Public Interest Litigations (PILs)</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-destructive/10 text-destructive px-4 py-1.5 rounded-full text-sm font-bold border border-destructive/20 flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        Admin Mode
                    </div>
                    <button
                        onClick={handleAdminLogout}
                        className="bg-foreground text-background px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#800000] text-white">
                            <tr>
                                <th className="p-5 font-bold text-sm uppercase tracking-widest whitespace-nowrap">Petition Details</th>
                                <th className="p-5 font-bold text-sm uppercase tracking-widest whitespace-nowrap">Creator</th>
                                <th className="p-5 font-bold text-sm uppercase tracking-widest whitespace-nowrap text-center">Support</th>
                                <th className="p-5 font-bold text-sm uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="p-5 font-bold text-sm uppercase tracking-widest whitespace-nowrap text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pils.map((pil) => (
                                <tr key={pil.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="font-black text-foreground mb-1 group-hover:text-primary transition-colors">{pil.title}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono opacity-50">ID: {pil.id}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                                {pil.creatorName?.charAt(0) || "A"}
                                            </div>
                                            <span className="text-sm font-bold text-muted-foreground">{pil.creatorName || "Anonymous"}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-black">
                                            {pil.supporters}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="space-y-2">
                                            <select
                                                value={pil.status || "Filed"}
                                                onChange={(e) => updateStatus(pil.id, e.target.value)}
                                                className="w-full bg-background border border-border p-2 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:border-primary/50 transition-all font-mono"
                                            >
                                                <option value="Filed">Filed</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="Admitted">Admitted</option>
                                                <option value="Hearing">Hearing</option>
                                                <option value="Heard">Heard (Concluded)</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Success">Success</option>
                                            </select>

                                            {pil.status === "Heard" && (
                                                <div className="space-y-2">
                                                    <textarea
                                                        placeholder="Enter hearing result..."
                                                        defaultValue={pil.hearingResult || ""}
                                                        onBlur={(e) => updateDoc(doc(db, "pils", pil.id), { hearingResult: e.target.value })}
                                                        className="w-full text-[10px] p-2 bg-muted/50 border border-border rounded-md font-medium"
                                                        rows={2}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Result Date (e.g. 15 Oct 2026)"
                                                        defaultValue={pil.hearingDate || ""}
                                                        onBlur={(e) => updateDoc(doc(db, "pils", pil.id), { hearingDate: e.target.value })}
                                                        className="w-full text-[10px] p-2 bg-muted/50 border border-border rounded-md font-mono"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => router.push(`/pil/${pil.id}`)}
                                                className="p-2.5 bg-muted text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all active:scale-90"
                                                title="View/Edit Details"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pil.id)}
                                                className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-xl transition-all active:scale-90"
                                                title="Delete PIL"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pils.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30">
                            <Clock size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">Safe Base Clean</h3>
                            <p className="text-muted-foreground text-sm">No PILs currently found in the database system.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 p-8 bg-destructive/5 border border-destructive/10 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive shrink-0">
                    <AlertTriangle size={32} />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black text-destructive">Administrative Safeguards</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl font-medium">
                        You have full authority to modify and remove records from the core database. Please exercise extreme caution, as deletions are permanent and status updates are visible to the public in real-time.
                    </p>
                </div>
            </div>
        </div>
    );
}
