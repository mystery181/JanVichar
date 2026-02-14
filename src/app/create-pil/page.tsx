"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Zap,
    Send,
    AlertCircle,
    ChevronLeft,
    Sparkles,
    Info,
    CheckCircle2,
    FileText,
    Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
        setValidation("");
        try {
            console.log("Starting AI validation with gemini-1.5-flash...");
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
            // Use gemini-1.5-flash as it's the newer standard
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `You are a legal expert helping a citizen refine a Public Interest Litigation (PIL). 
            Validate this PIL for completeness, legal tone, and clarity. Suggest 3 specific improvements.
            
            Title: ${title}
            Description: ${description}
            Evidence: ${evidence}
            
            Format your response in professional markdown with clear sections.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            setValidation(response.text());
        } catch (error: any) {
            console.error("Validation failed", error);
            if (error?.message?.includes("404")) {
                setValidation("AI validation is currently undergoing maintenance. Please proceed with your draft.");
            } else {
                setValidation("Could not validate at this time. Our AI assistant is currently over-taxed. Please proceed manually.");
            }
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
                title: title.trim(),
                description: description.trim(),
                evidence: evidence.trim(),
                createdBy: user.uid,
                creatorName: user.displayName || "Anonymous",
                createdAt: serverTimestamp(),
                supporters: 0,
                status: "Filed",
                upvotedBy: []
            });
            router.push(`/pil/${docRef.id}`);
        } catch (error) {
            console.error("Error creating PIL:", error);
            alert("Failed to create petition. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                    <Info size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    You must be signed in to draft and file a Public Interest Litigation on our platform.
                </p>
                <Link
                    href="/login"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
                >
                    Sign in with Google
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border py-4 sticky top-[65px] z-30">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/tracker" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight hidden sm:block">File a New PIL</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={validatePIL}
                            disabled={validating || !title || !description}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/20 disabled:opacity-50 transition-all"
                        >
                            {validating ? <Sparkles size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            <span className="hidden sm:inline">AI Validate</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    {/* Form Left Side */}
                    <div className="space-y-8">
                        <section className="bg-background p-8 rounded-3xl border border-border shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <FileText size={16} className="text-primary" />
                                        Petition Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Mandatory urban tree replanting in New Delhi"
                                        className="w-full text-lg font-semibold bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Use a clear, concise title that summarizes the issue.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Info size={16} className="text-primary" />
                                        Detailed Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the issue, who it affects, and what legal remedy you are seeking..."
                                        rows={8}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <LinkIcon size={16} className="text-primary" />
                                        Evidence & Resources
                                    </label>
                                    <textarea
                                        value={evidence}
                                        onChange={(e) => setEvidence(e.target.value)}
                                        placeholder="Links to news reports, scientific studies, or physical evidence descriptions..."
                                        rows={3}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-secondary/20 hover:shadow-secondary/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin rounded-full" /> : <Send size={20} />}
                                    File Public Petition
                                </button>
                            </form>
                        </section>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4">
                            <AlertCircle className="text-primary flex-shrink-0" size={24} />
                            <div className="text-sm">
                                <span className="font-bold block mb-1 text-primary">Civic Responsibility Note</span>
                                <p className="text-muted-foreground leading-relaxed">
                                    Redundant or malicious filings may be flagged by the community. Ensure your petition reflects a genuine matter of public interest.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview/Feedback Right Side */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {validation ? (
                                <motion.div
                                    key="ai-feedback"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-background rounded-3xl border border-primary/30 shadow-xl overflow-hidden"
                                >
                                    <div className="bg-primary px-6 py-4 flex items-center justify-between text-white">
                                        <div className="flex items-center gap-3">
                                            <Sparkles size={20} />
                                            <span className="font-bold">AI Legal Assistant</span>
                                        </div>
                                        <button onClick={() => setValidation("")} className="hover:bg-white/10 rounded-full p-1 transition-colors">
                                            <Info size={16} />
                                        </button>
                                    </div>
                                    <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {validation}
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={() => {
                                                    // This would ideally apply suggestions, but for now just acknowledge
                                                    setValidation("");
                                                }}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                                            >
                                                <CheckCircle2 size={16} />
                                                Got it, thanks!
                                            </button>
                                            <button
                                                onClick={validatePIL}
                                                className="bg-muted text-foreground px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                                            >
                                                <Zap size={16} />
                                                Re-analyze Draft
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview-placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-background/50 border border-border border-dashed rounded-3xl p-12 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30">
                                        <Sparkles size={32} />
                                    </div>
                                    <div className="max-w-xs">
                                        <h3 className="font-bold mb-1">AI Feedback Pending</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Complete the title and description, then click "AI Validate"
                                            to get instant suggestions on your petition's strength.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Visual Preview */}
                        <div className="bg-indigo-950/5 border border-indigo-900/10 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Live Preview Card</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <div className="w-2 h-2 rounded-full bg-indigo-300" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl p-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <div className="bg-blue-100 text-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Filed</div>
                                </div>
                                <h4 className={cn("text-lg font-bold mb-2", !title && "text-muted-foreground/20")}>
                                    {title || "Petition Title Appears Here"}
                                </h4>
                                <p className={cn("text-xs leading-relaxed mb-6", !description && "text-muted-foreground/10")}>
                                    {description ? (description.substring(0, 180) + "...") : "Your detailed case description will be summarized here for the public feed..."}
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10" />
                                        <div className="h-2 w-16 bg-muted rounded" />
                                    </div>
                                    <div className="h-6 w-16 bg-primary/5 rounded border border-primary/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
