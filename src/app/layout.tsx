import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JanVichar - Indian PIL Filing Portal",
  description: "Empowering Citizens, Strengthening Democracy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer>
            <div className="container">
              <p>&copy; 2026 JanVichar. All rights reserved.</p>
              <div className="footer-links" style={{ display: "flex", gap: "20px" }}>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/contact">Contact Us</Link>
              </div>
              <div style={{ marginTop: "10px", textAlign: "right", opacity: 0.3, fontSize: "0.7rem" }}>
                <Link href="/admin-login" style={{ textDecoration: "none", color: "inherit" }}>Admin</Link>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
