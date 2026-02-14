"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
    Scale
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/learn", icon: Info },
        { name: "Tracker", href: "/tracker", icon: Scale },
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
                        <img src="/logo.png" alt="JanVichar Logo" className="object-contain w-full h-full" />
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
                                    className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-95"
                                >
                                    <PlusCircle size={18} />
                                    <span>File PIL</span>
                                </Link>
                                <div className="flex items-center gap-3 pl-2 border-l border-border">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-muted-foreground">Welcome</span>
                                        <span className="text-sm font-bold">{user.displayName?.split(" ")[0]}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg active:scale-95"
                            >
                                Login
                            </button>
                        )}

                        <Link
                            href="/admin-login"
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border border-primary/20 flex items-center gap-2 hover:shadow-sm"
                        >
                            <User size={14} />
                            Admin Portal
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
                                        href="/create-pil"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 bg-secondary text-white p-3 rounded-lg font-bold"
                                    >
                                        <PlusCircle size={20} />
                                        File PIL
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="flex items-center justify-center gap-2 border border-border p-3 rounded-lg font-bold text-muted-foreground"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { login(); setIsOpen(false); }}
                                    className="bg-primary text-white p-3 rounded-lg font-bold"
                                >
                                    Login with Google
                                </button>
                            )}

                            <Link
                                href="/admin-login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg font-bold text-xs uppercase tracking-widest text-muted-foreground border border-border hover:bg-muted"
                            >
                                Admin Portal
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
