"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Megaphone,
  Sparkles,
  Phone,
} from "lucide-react";
import { SiteSettings } from "@/lib/adminStore";

interface SettingsViewProps {
  settings: SiteSettings;
  onSaveSettings: (updated: SiteSettings) => void;
}

export default function SettingsView({
  settings,
  onSaveSettings,
}: SettingsViewProps) {
  const [formState, setFormState] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-4">
            <Phone className="w-4 h-4 text-[#d4af37]" />
            <h3>Contact &amp; Support Channels</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-foreground font-semibold mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={formState.contactEmail}
                onChange={(e) =>
                  setFormState({ ...formState, contactEmail: e.target.value })
                }
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">
                Support Phone
              </label>
              <input
                type="text"
                value={formState.contactPhone}
                onChange={(e) =>
                  setFormState({ ...formState, contactPhone: e.target.value })
                }
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formState.whatsappNumber}
                onChange={(e) =>
                  setFormState({ ...formState, whatsappNumber: e.target.value })
                }
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-foreground font-semibold mb-1.5">
                Instagram URL
              </label>
              <input
                type="text"
                value={formState.instagramUrl}
                onChange={(e) =>
                  setFormState({ ...formState, instagramUrl: e.target.value })
                }
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-foreground font-semibold mb-1.5">
                Alleppey Office Address
              </label>
              <input
                type="text"
                value={formState.officeAddress}
                onChange={(e) =>
                  setFormState({ ...formState, officeAddress: e.target.value })
                }
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] hover:from-[#e5bf45] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Site Settings</span>
        </button>
      </form>
    </div>
  );
}
