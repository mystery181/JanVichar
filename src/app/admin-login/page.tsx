"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";

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
        const VALID_ID = "stackoverflowed";
        const VALID_PASS = "12345678";

        if (adminId.toLowerCase() === VALID_ID.toLowerCase() && password === VALID_PASS) {
            localStorage.setItem("jv_admin_session", "true");
            router.push("/admin-jv-portal");
        } else {
            setError("Invalid Administrative Credentials");
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 bg-muted/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card w-full max-w-md p-10 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 text-primary shadow-inner">
                        <Lock size={40} className="drop-shadow-sm" />
                    </div>

                    <h2 className="text-3xl font-black tracking-tight text-primary mb-2 text-center">Admin Access</h2>
                    <p className="text-muted-foreground text-center font-medium mb-10 text-sm px-4">
                        Please enter your administrative credentials to access the secure portal.
                    </p>

                    <form onSubmit={handleLogin} className="w-full space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Admin ID</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={adminId}
                                    onChange={(e) => setAdminId(e.target.value)}
                                    placeholder="e.g. jv-admin"
                                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-muted-foreground/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Secret Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold placeholder:text-muted-foreground/50"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-destructive/10 text-destructive text-sm font-bold p-4 rounded-xl border border-destructive/20 text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
                        >
                            Enter Portal
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
