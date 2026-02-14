import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JanVichar - Collaborative PIL Filing Portal for Indian Citizens",
  description: "Empowering 1.4 billion voices through collaborative legal action. Draft, discuss, and file Public Interest Litigations (PILs) with AI-powered assistance.",
  keywords: ["PIL", "JanVichar", "Indian Law", "Civic Action", "Legal Tech", "Public Interest Litigation", "Gemini AI"],
  authors: [{ name: "JanVichar Team" }],
  openGraph: {
    title: "JanVichar - Indian PIL Filing Portal",
    description: "Civic Action, Simplified. Join the movement for professional legal empowerment.",
    url: "https://janvichar.in",
    siteName: "JanVichar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JanVichar - Civic Action, Simplified",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JanVichar - Indian PIL Filing Portal",
    description: "Empowering Citizens, Strengthening Democracy.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://janvichar.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="border-t py-8 bg-muted/30">
              <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">&copy; 2026 JanVichar. All rights reserved.</p>
                <div className="flex gap-6 text-sm">
                  <Link href="/privacy" className="hover:text-primary underline-offset-4 hover:underline">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-primary underline-offset-4 hover:underline">Terms of Service</Link>
                  <Link href="/contact" className="hover:text-primary underline-offset-4 hover:underline">Contact Us</Link>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
