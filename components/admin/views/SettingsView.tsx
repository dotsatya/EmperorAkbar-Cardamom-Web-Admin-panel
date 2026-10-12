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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#d4af37]" />
            Site Branding &amp; Hero Customizer
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Control the announcement banner, homepage hero copy, brand endorsements, and contact channels
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Announcement Bar */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Megaphone className="w-4 h-4 text-[#d4af37]" />
              <h3>Storefront Announcement Bar</h3>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formState.showAnnouncement}
                onChange={(e) => setFormState({ ...formState, showAnnouncement: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Announcement Message
            </label>
            <input
              type="text"
              value={formState.announcementText}
              onChange={(e) => setFormState({ ...formState, announcementText: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* 2. Hero Section Content */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h3>Homepage Hero Copywriting</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground font-semibold mb-1.5">Super Subtitle</label>
                <input
                  type="text"
                  value={formState.heroSubtitle}
                  onChange={(e) => setFormState({ ...formState, heroSubtitle: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-1.5">Main Hero Title</label>
                <input
                  type="text"
                  value={formState.heroTitle}
                  onChange={(e) => setFormState({ ...formState, heroTitle: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">Tagline</label>
              <input
                type="text"
                value={formState.heroTagline}
                onChange={(e) => setFormState({ ...formState, heroTagline: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">Hero Body Description</label>
              <textarea
                rows={3}
                value={formState.heroDescription}
                onChange={(e) => setFormState({ ...formState, heroDescription: e.target.value })}
                className="w-full bg-background border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">
                Chef Mohamad Chabchoul Quote / Endorsement
              </label>
              <textarea
                rows={2}
                value={formState.chefQuote}
                onChange={(e) => setFormState({ ...formState, chefQuote: e.target.value })}
                className="w-full bg-background border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* 3. Contact Details */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-4">
            <Phone className="w-4 h-4 text-[#d4af37]" />
            <h3>Contact &amp; Support Channels</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-foreground font-semibold mb-1.5">Support Email</label>
              <input
                type="email"
                value={formState.contactEmail}
                onChange={(e) => setFormState({ ...formState, contactEmail: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">Support Phone</label>
              <input
                type="text"
                value={formState.contactPhone}
                onChange={(e) => setFormState({ ...formState, contactPhone: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">WhatsApp Number</label>
              <input
                type="text"
                value={formState.whatsappNumber}
                onChange={(e) => setFormState({ ...formState, whatsappNumber: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={formState.instagramUrl}
                onChange={(e) => setFormState({ ...formState, instagramUrl: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-foreground font-semibold mb-1.5">Alleppey Office Address</label>
              <input
                type="text"
                value={formState.officeAddress}
                onChange={(e) => setFormState({ ...formState, officeAddress: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Site Settings</span>
        </button>
      </form>

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
