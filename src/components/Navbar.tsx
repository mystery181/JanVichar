"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
    Menu,
    X,
    Moon,
    Sun,
    ChevronRight,
    User,
    LogOut,
    PlusCircle,
    Home,
    Info,
    Scale,
    Languages,
    ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [langOpen, setLangOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: t("nav.home"), href: "/", icon: Home },
        { name: t("nav.about"), href: "/learn", icon: Info },
        { name: t("nav.tracker"), href: "/tracker", icon: Scale },
    ];

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 border-b",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-border py-2"
                    : "bg-background border-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 overflow-hidden transition-transform group-hover:scale-110">
                        <Image src="/logo.png" alt="JanVichar Logo" fill className="object-contain" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-primary">
                        Jan<span className="text-secondary">Vichar</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors text-sm font-bold"
                            >
                                <Languages size={20} />
                                <span className="uppercase">{language.substring(0, 2)}</span>
                                <ChevronDown size={14} className={cn("transition-transform", langOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-32 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50"
                                    >
                                        {(['hinglish', 'english', 'hindi'] as Language[]).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => {
                                                    setLanguage(lang);
                                                    setLangOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors capitalize",
                                                    language === lang ? "text-primary font-bold bg-primary/5" : "text-muted-foreground"
                                                )}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                            {!mounted && <div className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/create-pil"
                                    className="hidden lg:flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-95"
                                >
                                    <PlusCircle size={18} />
                                    <span>{t("nav.file_pil")}</span>
                                </Link>

                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-muted transition-colors border border-border"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={18} />
                                        </div>
                                        <div className="hidden sm:flex flex-col items-start pr-2">
                                            <span className="text-[10px] text-muted-foreground leading-tight">{t("nav.profile")}</span>
                                            <span className="text-sm font-bold leading-tight">{user.displayName?.split(" ")[0]}</span>
                                        </div>
                                        <ChevronDown size={14} className={cn("transition-transform mr-1", profileOpen && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1"
                                            >
                                                <div className="px-3 py-2 border-b mb-1">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("profile.stats_title")}</p>
                                                    <p className="text-sm font-bold truncate">{user.email}</p>
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                                                >
                                                    <User size={18} />
                                                    {t("nav.profile")}
                                                </Link>
                                                <Link
                                                    href="/profile#pils"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                                                >
                                                    <Scale size={18} />
                                                    {t("profile.my_pils")}
                                                </Link>
                                                <div className="h-px bg-border my-1" />
                                                <button
                                                    onClick={() => { logout(); setProfileOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-colors text-sm font-medium"
                                                >
                                                    <LogOut size={18} />
                                                    {t("nav.logout")}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-95"
                            >
                                {t("nav.login")}
                            </button>
                        )}

                        <Link
                            href="/admin-login"
                            className="hidden xl:flex bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border border-primary/20 items-center gap-2 hover:shadow-sm"
                        >
                            <Scale size={14} />
                            {t("nav.admin")}
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-muted"
                    >
                        {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                        {!mounted && <div className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-primary"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-t"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg font-medium transition-colors",
                                        pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <link.icon size={20} />
                                        {link.name}
                                    </div>
                                    <ChevronRight size={18} />
                                </Link>
                            ))}

                            <div className="h-px bg-border my-2" />

                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-lg font-medium bg-muted"
                                    >
                                        <div className="flex items-center gap-3">
                                            <User size={20} />
                                            {t("nav.profile")}
                                        </div>
                                        <ChevronRight size={18} />
                                    </Link>
                                    <Link
                                        href="/create-pil"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 bg-secondary text-white p-3 rounded-lg font-bold"
                                    >
                                        <PlusCircle size={20} />
                                        {t("nav.file_pil")}
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="flex items-center justify-center gap-2 border border-border p-3 rounded-lg font-bold text-muted-foreground"
                                    >
                                        <LogOut size={20} />
                                        {t("nav.logout")}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { login(); setIsOpen(false); }}
                                    className="bg-primary text-white p-3 rounded-lg font-bold"
                                >
                                    {t("nav.login")}
                                </button>
                            )}

                            <Link
                                href="/admin-login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg font-bold text-xs uppercase tracking-widest text-muted-foreground border border-border hover:bg-muted"
                            >
                                {t("nav.admin")}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
