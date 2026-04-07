"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <section className="bg-white dark:bg-[#0D1F42] rounded-2xl p-8 shadow-sm border border-[#edd3ff]/30 dark:border-[#1E3A5F]">
      <h3 className="text-lg font-bold text-[#3a264b] dark:text-[#E2E8F0] flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-[#702ae1] dark:text-[#A78BFA]">palette</span>
        Appearance
      </h3>
      <p className="text-sm text-[#69537b] dark:text-[#94A3B8] mb-6">Choose your preferred theme for the dashboard.</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Light Mode */}
        <button
          onClick={() => setTheme("light")}
          className={`relative p-5 rounded-xl border-2 text-left transition-all ${
            isLight
              ? "border-[#702ae1] bg-[#fef3ff] dark:bg-[#0F2147]"
              : "border-[#edd3ff]/50 dark:border-[#1E3A5F] bg-white dark:bg-[#0D1F42] opacity-70 hover:opacity-100 hover:border-[#702ae1]/40"
          }`}
        >
          {isLight && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-[#702ae1] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
            </div>
          )}
          <div className="w-full h-16 rounded-lg bg-white dark:bg-[#1A3366] border border-[#edd3ff] dark:border-[#1E3A5F] mb-4 flex items-center px-3 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#702ae1]"></div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-[#edd3ff] dark:bg-[#2D1B69] rounded-full w-3/4"></div>
              <div className="h-1.5 bg-[#f5e2ff] dark:bg-[#1E3A5F] rounded-full w-1/2"></div>
            </div>
          </div>
          <p className="font-bold text-sm text-[#3a264b] dark:text-[#E2E8F0]">Light Mode</p>
          <p className="text-xs text-[#69537b] dark:text-[#94A3B8]">Clean & bright</p>
        </button>

        {/* Dark Mode */}
        <button
          onClick={() => setTheme("dark")}
          className={`relative p-5 rounded-xl border-2 text-left transition-all ${
            !isLight
              ? "border-[#702ae1] bg-[#0F2147]"
              : "border-[#edd3ff]/50 bg-white opacity-70 hover:opacity-100 hover:border-[#702ae1]/40"
          }`}
        >
          {!isLight && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-[#702ae1] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
            </div>
          )}
          <div className="w-full h-16 rounded-lg bg-[#0B1B3D] border border-[#1a2d5a] mb-4 flex items-center px-3 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#702ae1]"></div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-[#1a2d5a] rounded-full w-3/4"></div>
              <div className="h-1.5 bg-[#142347] rounded-full w-1/2"></div>
            </div>
          </div>
          <p className="font-bold text-sm text-[#3a264b] dark:text-[#E2E8F0]">Dark Mode</p>
          <p className="text-xs text-[#69537b] dark:text-[#94A3B8]">Deep navy</p>
        </button>
      </div>
    </section>
  );
}
