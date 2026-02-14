"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="border-t py-12 bg-muted/30">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-8">
                    <div className="space-y-2">
                        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
                            Jan<span className="text-secondary">Vichar</span>
                        </Link>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            &copy; {new Date().getFullYear()} JanVichar. {t("footer.rights")}
                        </p>
                    </div>
                    <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 text-sm font-semibold">
                        <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                            {t("footer.privacy")}
                        </Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                            {t("footer.terms")}
                        </Link>
                        <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                            {t("footer.contact")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
