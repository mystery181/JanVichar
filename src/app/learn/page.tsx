"use client";

import React from "react";

export default function Learn() {
    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <section className="bg-primary py-24 px-4 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 -left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                        Understanding Public Interest Litigation
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                        A comprehensive guide to your rights, procedures, and the power of PIL in the Indian legal system.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* What is PIL */}
                        <section className="bg-card border border-border p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all">
                            <h3 className="text-3xl font-black text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">01</span>
                                What is a PIL?
                            </h3>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                                <p className="mb-4">
                                    Public Interest Litigation (PIL) is a landmark legal mechanism that allows any citizen or organization to approach the court for solutions to issues affecting the public at large.
                                </p>
                                <p>
                                    Unlike traditional litigation, which requires personal grievance, a PIL can be filed by any socially conscious person on behalf of the oppressed or for the greater good. It was championed by Justice P.N. Bhagwati in the 1980s to make justice accessible to the marginalized.
                                </p>
                            </div>
                        </section>

                        {/* Constitutional Provisions */}
                        <section className="bg-card border border-border p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all">
                            <h3 className="text-3xl font-black text-primary mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">02</span>
                                Constitutional Provisions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="bg-muted/30 border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group">
                                    <div className="text-primary font-black text-lg mb-2 group-hover:translate-x-1 transition-transform">Article 32</div>
                                    <p className="text-sm text-muted-foreground font-medium">Enforcement of Fundamental Rights in the Supreme Court. The &quot;heart and soul&quot; of the Constitution.</p>
                                </div>
                                <div className="bg-muted/30 border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group">
                                    <div className="text-primary font-black text-lg mb-2 group-hover:translate-x-1 transition-transform">Article 226</div>
                                    <p className="text-sm text-muted-foreground font-medium">Empowers High Courts to issue writs for Fundamental Rights and &quot;any other purpose.&quot;</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-8 rounded-2xl rounded-l-none">
                                <h4 className="text-amber-800 dark:text-amber-400 font-black text-xl mb-4">Key PIL Scope</h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-amber-700 dark:text-amber-500/80">
                                    <li className="flex items-center gap-2">✔ Bonded & Child Labor</li>
                                    <li className="flex items-center gap-2">✔ Environmental Pollution</li>
                                    <li className="flex items-center gap-2">✔ Human Rights Violations</li>
                                    <li className="flex items-center gap-2">✔ Consumer Protection</li>
                                    <li className="flex items-center gap-2">✔ Heritage Conservation</li>
                                    <li className="flex items-center gap-2">✔ Public Health Issues</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Who Can File */}
                        <section className="bg-indigo-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden sticky top-[100px]">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mb-16 blur-2xl" />
                            <h3 className="text-2xl font-black mb-8 leading-tight">Who Can File a PIL?</h3>
                            <div className="space-y-6">
                                {[
                                    "Any citizen of India or registered NGO.",
                                    "Petitions must be filed for PUBLIC interest only.",
                                    "The petitioner need not be the person directly harmed.",
                                    "Courts can also act on their own (Suo Moto)."
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-black">✔</span>
                                        </div>
                                        <p className="text-sm font-medium text-indigo-100">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 pt-6 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                Citizen Powered Justice
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
