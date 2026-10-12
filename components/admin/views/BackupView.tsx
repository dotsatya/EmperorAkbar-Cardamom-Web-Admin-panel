"use client";

import React, { useState } from "react";
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import { WebsiteCMSData } from "@/lib/adminStore";

interface BackupViewProps {
  data: WebsiteCMSData;
  onRestoreData: (restored: WebsiteCMSData) => void;
  onResetData: () => void;
}

export default function BackupView({
  data,
  onRestoreData,
  onResetData,
}: BackupViewProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `emperorakbar-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setImportStatus("Website backup downloaded successfully!");
    setIsError(false);
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.products || !parsed.settings) {
          throw new Error("Invalid backup structure: missing products or settings");
        }
        onRestoreData(parsed);
        setImportStatus("Backup successfully restored to live store!");
        setIsError(false);
      } catch (err: unknown) {
        setIsError(true);
        const msg = err instanceof Error ? err.message : "Unknown error occurred";
        setImportStatus(`Failed to import JSON: ${msg}`);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        "⚠️ WARNING: This will reset all products, recipes, articles, and settings back to default original seed data. Continue?"
      )
    ) {
      onResetData();
      setImportStatus("Storefront reset back to default original data!");
      setIsError(false);
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-[#d4af37]" />
            Data Backup, Migration &amp; Factory Reset
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Export and import your entire website database as a JSON file, or restore factory defaults
          </p>
        </div>
      </div>

      {importStatus && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
            isError
              ? "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{importStatus}</span>
        </div>
      )}

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">Export Complete Store JSON</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Download your current configuration containing all products, recipes, blogs, and settings into a standalone JSON file for safe offline keeping.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 hover:from-[#e5bf45] transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">Import / Restore from JSON</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Restore previously exported store settings or bulk update the catalog by selecting a JSON backup file from your computer.
            </p>
          </div>

          <label className="w-full py-3 rounded-xl bg-muted hover:bg-accent border border-border text-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all">
            <FileCode className="w-4 h-4 text-[#d4af37]" />
            <span>Select JSON File</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground mb-1">Factory Reset to Original Defaults</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Clears all modifications and restores default product prices, recipes, blogs, and settings as defined in the original repository.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-600 hover:text-white border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
