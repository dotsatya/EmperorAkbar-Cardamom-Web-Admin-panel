"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, LogOut, CheckCircle, Menu } from "lucide-react";
import { setAdminAuth } from "@/lib/adminStore";

interface AdminHeaderProps {
  onLogout: () => void;
  onToggleSidebar: () => void;
  ordersCount?: number;
}

export default function AdminHeader({ onLogout, onToggleSidebar }: AdminHeaderProps) {
  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to sign out from the Admin Panel?")) {
      setAdminAuth(false);
      onLogout();
    }
  };

  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between text-foreground">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-muted border border-border text-foreground flex items-center justify-center hover:bg-accent"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Client-Side CMS
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Auto-Sync Active
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Customer Site Preview Link */}
        <Link
          href="/"
          target="_blank"
          className="px-3.5 py-1.5 rounded-xl bg-card border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-stone-900 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Profile Pill */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-card border border-border">
          <div className="w-6 h-6 rounded-lg bg-[#d4af37] text-stone-900 flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-foreground leading-none">Akbar Admin</p>
            <p className="text-[10px] text-muted-foreground">Master Access</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
