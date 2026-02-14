"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
    Link as LinkIcon,
    HelpCircle,
    ArrowRight,
    ChevronRight,
    Search,
    Upload,
    X,
    File,
    Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PIL {
    id: string;
    title: string;
    description: string;
    supporters: number;
    createdAt: { seconds: number; nanoseconds: number } | null;
    creatorName?: string;
    status?: string;
    evidenceFiles?: { name: string; url: string; type: string }[];
}

export default function CreatePIL() {
    const { user, login } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [evidence, setEvidence] = useState("");
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState("");
    const [validating, setValidating] = useState(false);
    const [duplicates, setDuplicates] = useState<PIL[]>([]);
    const [searchingDuplicates, setSearchingDuplicates] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (title.length < 5) {
            setDuplicates([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setSearchingDuplicates(true);
            try {
                // Simplified duplicate check: search for existing PILs with similar titles
                const q = query(collection(db, "pils"), limit(50));
                const snapshot = await getDocs(q);
                const matching = snapshot.docs
                    .map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            title: data.title || "",
                            description: data.description || "",
                            supporters: data.supporters || 0,
                            createdAt: data.createdAt || null,
                            status: data.status || "Filed"
                        } as PIL;
                    })
                    .filter(pil =>
                        pil.title.toLowerCase().includes(title.toLowerCase()) ||
                        title.toLowerCase().includes(pil.title.toLowerCase())
                    )
                    .slice(0, 3);
                setDuplicates(matching);
            } catch (error) {
                console.error("Error searching duplicates:", error);
            } finally {
                setSearchingDuplicates(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [title]);

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
            Also, if the following content looks like a duplicate of existing issues, mention it.
            
            Title: ${title}
            Description: ${description}
            Evidence: ${evidence}
            
            Format your response in professional markdown with clear sections. Use ${t("hero.title")} as a reference for the platform name.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            setValidation(response.text());
        } catch (error: unknown) {
            console.error("Validation failed", error);
            if (error instanceof Error && error.message?.includes("404")) {
                setValidation("AI validation is currently undergoing maintenance. Please proceed with your draft.");
            } else {
                setValidation("Could not validate at this time. Our AI assistant is currently over-taxed. Please proceed manually.");
            }
        } finally {
            setValidating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setUploading(true);

        try {
            const fileUrls = [];

            // 1. Upload Files to Firebase Storage
            for (const file of files) {
                const storageRef = ref(storage, `evidence/${user.uid}/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                const url = await new Promise<string>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                        },
                        (error: Error) => reject(error),
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        }
                    );
                });
                fileUrls.push({
                    name: file.name,
                    url: url,
                    type: file.type
                });
            }

            // 2. Save PIL with File URLs
            const docRef = await addDoc(collection(db, "pils"), {
                title: title.trim(),
                description: description.trim(),
                evidence: evidence.trim(),
                evidenceFiles: fileUrls,
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
            setUploading(false);
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
                <button
                    onClick={() => login()}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
                >
                    {t("nav.login")}
                </button>
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
                        <h1 className="text-xl font-bold tracking-tight hidden sm:block">{t("create_pil.title")}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={validatePIL}
                            disabled={validating || !title || !description}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/20 disabled:opacity-50 transition-all"
                        >
                            {validating ? <Sparkles size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            <span className="hidden sm:inline">{t("create_pil.ai_validate")}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                    {/* Form Left Side */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-background p-8 rounded-3xl border border-border shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <FileText size={16} className="text-primary" />
                                        {t("create_pil.form_title")}
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t("create_pil.placeholder_title")}
                                        className="w-full text-lg font-semibold bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                    <AnimatePresence>
                                        {duplicates.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl"
                                            >
                                                <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                                                    <AlertCircle size={14} />
                                                    {t("create_pil.duplicate_warning")}
                                                </p>
                                                <div className="space-y-2">
                                                    {duplicates.map((dup) => (
                                                        <Link
                                                            key={dup.id}
                                                            href={`/pil/${dup.id}`}
                                                            className="flex items-center justify-between bg-white dark:bg-background/50 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20 text-xs hover:border-amber-300 transition-colors"
                                                        >
                                                            <span className="font-medium line-clamp-1">{dup.title}</span>
                                                            <ChevronRight size={14} />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Info size={16} className="text-primary" />
                                        {t("create_pil.form_desc")}
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={t("create_pil.placeholder_desc")}
                                        rows={8}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <LinkIcon size={16} className="text-primary" />
                                        {t("create_pil.form_evidence")}
                                    </label>
                                    <textarea
                                        value={evidence}
                                        onChange={(e) => setEvidence(e.target.value)}
                                        placeholder={t("create_pil.placeholder_evidence")}
                                        rows={3}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Upload size={16} className="text-primary" />
                                        Upload Evidence (Images/PDFs)
                                    </label>

                                    <div className="flex flex-col gap-4">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                                <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                                                <p className="text-[10px] text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                                            </div>
                                            <input type="file" className="hidden" multiple accept="image/*,application/pdf" onChange={handleFileChange} />
                                        </label>

                                        {files.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {files.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border group">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            {file.type.startsWith("image/") ? <ImageIcon size={16} className="text-primary shrink-0" /> : <File size={16} className="text-primary shrink-0" />}
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-xs font-bold truncate">{file.name}</span>
                                                                {uploadProgress[file.name] !== undefined && (
                                                                    <div className="w-full bg-muted rounded-full h-1 mt-1">
                                                                        <div
                                                                            className="bg-primary h-full rounded-full transition-all"
                                                                            style={{ width: `${uploadProgress[file.name]}%` }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(i)}
                                                            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-all"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-secondary/20 hover:shadow-secondary/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin rounded-full" /> : <Send size={20} />}
                                    {uploading ? "Uploading Evidence..." : t("create_pil.submit")}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Right Side: Advice & AI Feedback */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Proactive Advice Section */}
                        <section className="bg-gradient-to-br from-indigo-500 to-primary p-6 rounded-3xl text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <HelpCircle size={24} />
                                <h3 className="font-bold text-lg">{t("create_pil.advice_title")}</h3>
                            </div>
                            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                                {t("create_pil.advice_description")}
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { step: t("create_pil.step_1_title"), text: t("create_pil.step_1_desc") },
                                    { step: t("create_pil.step_2_title"), text: t("create_pil.step_2_desc") },
                                    { step: t("create_pil.step_3_title"), text: t("create_pil.step_3_desc") },
                                    { step: t("create_pil.step_4_title"), text: t("create_pil.step_4_desc") }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                                        <div className="bg-white/20 h-6 w-12 flex items-center justify-center rounded text-[10px] font-bold shrink-0">
                                            {item.step}
                                        </div>
                                        <p className="text-xs leading-tight">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-6 bg-white text-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                                View Full Guide <ArrowRight size={16} />
                            </button>
                        </section>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4">
                            <AlertCircle className="text-primary flex-shrink-0" size={24} />
                            <div className="text-sm">
                                <span className="font-bold block mb-1 text-primary">{t("create_pil.responsibility_title")}</span>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t("create_pil.responsibility_desc")}
                                </p>
                            </div>
                        </div>

                        {/* Preview/Feedback Right Side */}
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
                                            Complete the title and description, then click &quot;{t("create_pil.ai_validate")}&quot;
                                            to get instant suggestions on your petition&apos;s strength.
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
