"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  FileText,
  Zap,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, login } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      title: "AI-Powered Drafting",
      description: "Gemini-powered suggestions to refine legal language and strengthen your petition.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Collaborative Democracy",
      description: "Work with other citizens to crowdsource evidence and support for public causes.",
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      title: "Real-time Tracking",
      description: "Monitor the status of your PIL from filing to final verdict with live updates.",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Professional Exports",
      description: "Generate court-ready PDF documents instantly with verified formatting.",
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] py-24 lg:py-32 text-white">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 -right-1/4 w-[1000px] h-[1000px] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs md:text-sm font-semibold mb-8 text-indigo-200"
            >
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Empowering 1.4 Billion Voices
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Jan Vichar – जन विचार
              <span className="block text-secondary mt-4 drop-shadow-sm">Civic Action, Simplified.</span>
            </h1>

            <p className="text-xl md:text-2xl text-indigo-100/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              The first collaborative platform for Indian citizens to draft, discuss, and file
              <span className="text-white border-b-2 border-secondary/50 mx-1">Public Interest Litigations</span> using AI assistance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {user ? (
                <Link
                  href="/create-pil"
                  className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-secondary/30 transition-all hover:-translate-y-1 hover:shadow-secondary/40 active:scale-95"
                >
                  Start a New PIL
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-secondary/30 transition-all hover:-translate-y-1 hover:shadow-secondary/40 active:scale-95"
                >
                  Start a New PIL
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <Link
                href="/tracker"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:bg-white/15"
              >
                Browse Cases
              </Link>
            </div>

            <div className="mt-20 flex flex-wrap justify-center items-center gap-10 opacity-60">
              <div className="flex items-center gap-3">
                <ShieldCheck size={22} />
                <span className="text-sm font-bold tracking-wider uppercase">Firebase Secure</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden md:block" />
              <div className="flex items-center gap-3 text-indigo-200">
                <Zap size={22} className="text-amber-400" />
                <span className="text-sm font-bold tracking-wider uppercase">Google Gemini AI</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden md:block" />
              <div className="flex items-center gap-3">
                <Users size={22} />
                <span className="text-sm font-bold tracking-wider uppercase">Community Powered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Modern Legal Toolkit</h2>
            <p className="text-muted-foreground text-lg italic">
              &quot;Ensuring justice is not a privilege, but a right accessible to every Indian.&quot;
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-2xl border bg-card hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.bg)}>
                  <feature.icon className={cn("w-7 h-7", feature.color)} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Activity / CTA Section */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Recent Public Interest Litigations</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Every petition starts with a single voice. Join thousands of citizens who are
                already making a difference in their communities.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Protection of urban wetlands in Bangalore",
                  "Digital literacy programs for rural farmers",
                  "Air quality monitoring in manufacturing hubs"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
              >
                Explore all active cases
                <ExternalLink size={18} />
              </Link>
            </div>

            <div className="w-full lg:w-1/2 p-1 bg-gradient-to-tr from-primary to-secondary rounded-2xl">
              <div className="bg-card rounded-xl p-8 shadow-2xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground tracking-tighter uppercase">PIL_DRAFT_V2.026</span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                  <div className="pt-4 flex gap-4">
                    <div className="h-10 bg-primary/20 rounded-lg w-1/3" />
                    <div className="h-10 bg-secondary/20 rounded-lg w-1/4" />
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-2xl border flex items-center gap-4 animate-bounce">
                  <Zap className="text-amber-500" size={32} />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">AI Suggestion</div>
                    <div className="font-bold">Summary Optimized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
