"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const emptySubscribe = () => () => {};

export default function ThemeToggle({
  className = "",
  showLabel = true,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className={`h-8 w-full rounded-lg bg-muted/40 animate-pulse ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group flex items-center justify-between w-full px-2.5 py-1.5 rounded-sm hover:bg-muted/40 text-foreground transition-all text-xs cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[#d4af37] transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
        )}
        {showLabel && (
          <span className="font-medium text-foreground group-data-[collapsible=icon]:hidden">
            {isDark ? "Dark Theme" : "Light Theme"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
          {isDark ? "Dark" : "Light"}
        </span>
      </div>
    </button>
  );
}

export { ThemeToggle };
