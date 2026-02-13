"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const pathname = usePathname();

    return (
        <header>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo">
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <img src="/logo.png" alt="JanVichar Logo" className="logo-img" />
                        <h1>JanVichar</h1>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link href="/" className={pathname === "/" ? "active" : ""}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/learn" className={pathname === "/learn" ? "active" : ""}>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/tracker" className={pathname === "/tracker" ? "active" : ""}>
                                Tracker
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li>
                                    <Link href="/create-pil" className="btn-tracker">
                                        File PIL
                                    </Link>
                                </li>
                                <li>
                                    <span style={{ color: "var(--primary-color)", fontWeight: "bold", marginRight: "10px" }}>
                                        Hi, {user.displayName?.split(" ")[0]}
                                    </span>
                                </li>
                                <li>
                                    <button onClick={logout} className="btn-secondary" style={{ padding: "8px 15px", cursor: "pointer" }}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button onClick={login} className="btn-primary" style={{ padding: "10px 20px", cursor: "pointer" }}>
                                    Login with Google
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
