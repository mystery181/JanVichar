"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
    User,
    Mail,
    Phone,
    Save,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Loader2,
    Settings,
    ShieldCheck,
    Activity,
    PlusCircle,
    ThumbsUp,
    Calendar,
    PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    bio: string;
}

interface UserPIL {
    id: string;
    title: string;
    status: string;
    createdAt: { seconds: number; nanoseconds: number } | null;
    supporters: number;
}

export default function ProfilePage() {
    const { user, login } = useAuth();
    const { t } = useLanguage();
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        phone: "",
        bio: ""
    });
    const [myPils, setMyPils] = useState<UserPIL[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchProfileAndPils = async () => {
            setLoading(true);
            try {
                // Fetch Profile
                const profileDoc = await getDoc(doc(db, "profiles", user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data() as UserProfile);
                } else {
                    setProfile({
                        name: user.displayName || "",
                        email: user.email || "",
                        phone: "",
                        bio: ""
                    });
                }

                // Fetch My PILs
                const pilsQuery = query(collection(db, "pils"), where("createdBy", "==", user.uid));
                const pilsSnapshot = await getDocs(pilsQuery);
                const pilsData = pilsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as UserPIL[];

                // Sort by date
                pilsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setMyPils(pilsData);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndPils();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage(null);
        try {
            await setDoc(doc(db, "profiles", user.uid), {
                ...profile,
                updatedAt: serverTimestamp()
            }, { merge: true });
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            console.error("Error saving profile:", error);
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                <AlertCircle size={48} className="text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Login Required</h1>
                <p className="text-muted-foreground mb-6">Please sign in to view your profile and tracking dashboard.</p>
                <button
                    onClick={login}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95"
                >
                    {t("nav.login")}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Profile Hero Header */}
            <div className="bg-primary pt-24 pb-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-white">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-xl border-4 border-white/20 flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-white/40" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-xl shadow-lg z-20">
                                <ShieldCheck size={20} />
                            </div>
                        </motion.div>
                        <div className="text-center md:text-left space-y-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.name || user.displayName || "Anonymous"}</h1>
                                <p className="text-indigo-100/70 font-medium flex items-center justify-center md:justify-start gap-2">
                                    <Mail size={16} /> {user.email}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 pb-20 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Stats & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border rounded-3xl p-6 shadow-xl"
                        >
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6 pb-2 border-b border-border/50">
                                {t("profile.stats_title")}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted p-4 rounded-2xl">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total PILs</p>
                                    <p className="text-2xl font-black text-primary">{myPils.length}</p>
                                </div>
                                <div className="bg-muted p-4 rounded-2xl">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Supported</p>
                                    <p className="text-2xl font-black text-secondary">
                                        {myPils.reduce((acc, curr) => acc + (curr.supporters || 0), 0)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Settings Form Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Settings className="text-primary" size={20} />
                                    {t("nav.profile")}
                                </h2>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                        <User size={12} /> {t("profile.name")}
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                        <Phone size={12} /> {t("profile.phone")}
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                        <FileText size={12} /> {t("profile.bio")}
                                    </label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        placeholder={t("profile.bio")}
                                        rows={3}
                                    />
                                </div>

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className={cn(
                                            "p-3 rounded-xl text-xs font-bold flex items-center gap-2",
                                            message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        )}
                                    >
                                        {message.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                        {message.text}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {t("profile.save")}
                                </button>
                            </form>
                        </motion.section>
                    </div>

                    {/* Right: Activity Tracker */}
                    <div id="pils" className="lg:col-span-8">
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card border border-border rounded-3xl p-8 shadow-xl min-h-[500px]"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black flex items-center gap-3">
                                        <Activity className="text-secondary" size={28} />
                                        {t("profile.my_pils")}
                                    </h2>
                                    <p className="text-sm text-muted-foreground font-medium">Tracking your public interest contributions.</p>
                                </div>
                                <Link
                                    href="/create-pil"
                                    className="flex items-center justify-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                                >
                                    <PlusCircle size={18} />
                                    {t("nav.file_pil")}
                                </Link>
                            </div>

                            {myPils.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {myPils.map((pil) => (
                                        <motion.div
                                            key={pil.id}
                                            whileHover={{ x: 5 }}
                                            className="group relative"
                                        >
                                            <Link
                                                href={`/pil/${pil.id}`}
                                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50 p-5 rounded-2xl transition-all"
                                            >
                                                <div className="flex-grow space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn(
                                                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-md",
                                                            pil.status?.toLowerCase() === "accepted" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                        )}>
                                                            {pil.status || "Filed"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                                            <Calendar size={12} />
                                                            {pil.createdAt ? new Date(pil.createdAt.seconds * 1000).toLocaleDateString() : "Draft"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                        {pil.title}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                                            <ThumbsUp size={14} fill="currentColor" />
                                                        </div>
                                                        <span className="font-bold text-sm">{pil.supporters || 0}</span>
                                                    </div>
                                                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-all" size={20} />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30">
                                        <PieChart size={48} />
                                    </div>
                                    <div className="max-w-xs space-y-2">
                                        <h3 className="font-bold text-xl">{t("profile.no_pils")}</h3>
                                        <p className="text-sm text-muted-foreground">Your advocacy journey starts here. File your first petition to see it tracked.</p>
                                    </div>
                                    <Link
                                        href="/create-pil"
                                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                                    >
                                        {t("nav.file_pil")}
                                    </Link>
                                </div>
                            )}
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
}
