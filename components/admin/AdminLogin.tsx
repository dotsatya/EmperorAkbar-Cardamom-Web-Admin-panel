"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { getAdminPassword, setAdminAuth } from "@/lib/adminStore";
import { Photos } from "@/data/websiteData";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const correctPassword = getAdminPassword();
      if (username.trim().toLowerCase() === "admin" && password === correctPassword) {
        setAdminAuth(true);
        onSuccess();
      } else {
        setError("Invalid username or password. Default is admin / akbar@admin2026");
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setUsername("admin");
    setPassword(getAdminPassword());
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[128px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] opacity-[0.03] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-card border border-border shadow-xl mb-4 p-2.5 relative group">
            <Image
              src={Photos.logo}
              alt="Emperor Akbar Logo"
              width={64}
              height={64}
              className="object-contain drop-shadow"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-foreground tracking-wide">
            Emperor Akbar
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#b89528] dark:text-[#d4af37] font-semibold">
              Master Admin Control Center
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Secure management suite for the entire flagship platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border backdrop-blur-2xl rounded-3xl p-7 sm:p-8 shadow-2xl relative text-card-foreground">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2 text-foreground text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-[#b89528] dark:text-[#d4af37]" />
              <span>Administrator Authentication</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-[#d4af37] font-bold">
              v2.6 Secure
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
                <span className="text-base leading-none">⚠️</span>
                <span className="flex-1">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Passcode / Key
                </label>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-[11px] text-[#b89528] dark:text-[#d4af37] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-fill Demo Key
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-background border border-input rounded-xl pl-10 pr-11 py-3 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] hover:to-[#cfa832] text-stone-900 font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Enter Admin Suite"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Info */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground">
              Demo Access: <span className="text-foreground font-mono font-semibold">admin</span> &bull; Key:{" "}
              <span className="text-[#b89528] dark:text-[#d4af37] font-mono font-semibold">akbar@admin2026</span>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6">
          <a
            href="./"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline decoration-border underline-offset-4"
          >
            &larr; Return to Emperor Akbar Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
