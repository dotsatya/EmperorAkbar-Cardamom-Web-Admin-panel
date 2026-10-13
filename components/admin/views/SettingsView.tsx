"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Key,
  Megaphone,
  Sparkles,
  Phone,
} from "lucide-react";
import { SiteSettings, getAdminPassword, setAdminPassword } from "@/lib/adminStore";

interface SettingsViewProps {
  settings: SiteSettings;
  onSaveSettings: (updated: SiteSettings) => void;
}

export default function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  const [formState, setFormState] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password change state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    const existing = getAdminPassword();

    if (currentPwd !== existing) {
      setPwdMsg({ text: "Current password does not match.", isError: true });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ text: "New password must be at least 6 characters.", isError: true });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ text: "New passwords do not match.", isError: true });
      return;
    }

    setAdminPassword(newPwd);
    setPwdMsg({ text: "Admin passcode successfully updated!", isError: false });
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  return (
    <div className="space-y-8 max-w-4xl">

      {/* 4. Admin Security / Passcode Manager */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-2">
          <Key className="w-4 h-4 text-[#d4af37]" />
          <h3>Admin Passcode Security</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Change the master passcode used to authenticate to this /admin panel
        </p>

        {pwdMsg && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 ${
              pwdMsg.isError
                ? "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {pwdMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block text-foreground font-semibold mb-1.5">Current Passcode</label>
            <input
              type="password"
              required
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              placeholder="akbar@admin2026"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-1.5">New Passcode</label>
            <input
              type="password"
              required
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-1.5">Confirm New Passcode</label>
            <input
              type="password"
              required
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-muted hover:bg-accent border border-border text-foreground font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Update Passcode
          </button>
        </form>
      </div>
    </div>
  );
}
