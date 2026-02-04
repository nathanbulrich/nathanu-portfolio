"use client";

import { useState, useCallback } from "react";
import { useTheme } from "../lib/ThemeContext";
import { CSS_VAR_MAP, DOT_COLORS } from "../lib/theme-definitions";

export default function ThemeDebugger() {
  const { activeTheme, palette, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyValue = useCallback((label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const copyAllAsCSS = useCallback(() => {
    const lines = (Object.keys(CSS_VAR_MAP) as Array<keyof typeof CSS_VAR_MAP>)
      .map((key) => `  ${CSS_VAR_MAP[key]}: ${palette[key]};`)
      .join("\n");
    const block = `/* Theme: ${activeTheme} */\n:root {\n${lines}\n}`;
    navigator.clipboard.writeText(block);
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  }, [activeTheme, palette]);

  if (process.env.NODE_ENV !== "development") return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white text-xs font-mono px-3 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors cursor-pointer"
        type="button"
      >
        Theme Debug
      </button>
    );
  }

  const entries: { label: string; varName: string; value: string }[] = [
    { label: "Background", varName: CSS_VAR_MAP.bg, value: palette.bg },
    { label: "Border", varName: CSS_VAR_MAP.border, value: palette.border },
    { label: "Text", varName: CSS_VAR_MAP.text, value: palette.text },
    { label: "Text Secondary", varName: CSS_VAR_MAP.textSecondary, value: palette.textSecondary },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] bg-white border border-gray-200 rounded-xl shadow-2xl font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="font-bold text-sm text-black">Theme Debugger</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          type="button"
        >
          Close
        </button>
      </div>

      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-gray-500 mb-2">
          Active: <span className="text-black font-bold">{activeTheme}</span>
        </div>
        <div className="flex gap-2">
          {DOT_COLORS.map(({ name, hex }) => (
            <button
              key={name}
              type="button"
              onClick={() => setTheme(name)}
              className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                activeTheme === name ? "border-black scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {entries.map(({ label, varName, value }) => (
          <div key={varName} className="flex items-center justify-between">
            <div>
              <div className="text-gray-400">{varName}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="inline-block w-4 h-4 rounded border border-gray-200 shrink-0"
                  style={{ backgroundColor: value }}
                />
                <span className="text-black">{value}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyValue(label, value)}
              className="text-gray-400 hover:text-black transition-colors px-2 py-1 cursor-pointer"
            >
              {copied === label ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <button
          type="button"
          onClick={copyAllAsCSS}
          className="w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {copied === "all" ? "Copied CSS block" : "Copy All as CSS"}
        </button>
      </div>
    </div>
  );
}
