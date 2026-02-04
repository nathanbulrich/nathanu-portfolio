"use client";

import { DOT_COLORS, type ThemeColorName } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";

interface DotRowProps {
  dotSize: string;
  gap: string;
  className?: string;
}

export default function DotRow({ dotSize, gap, className = "" }: DotRowProps) {
  const { activeTheme, setTheme } = useTheme();

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {DOT_COLORS.map(({ name, hex }) => {
        const isSelected = activeTheme === name;
        return (
          <button
            key={name}
            type="button"
            aria-label={`Set ${name} theme`}
            aria-pressed={isSelected}
            onClick={() => setTheme(name)}
            className={`${dotSize} rounded-full transition-transform duration-150 ease-out hover:scale-125 cursor-pointer border-0 p-0 ${
              isSelected ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              backgroundColor: hex,
              color: hex,
              outlineColor: hex,
              // ring-offset uses --tw-ring-offset-color which defaults to white
              // override to match page bg for seamless look
              ...(isSelected ? { "--tw-ring-color": hex, "--tw-ring-offset-color": "var(--theme-bg)" } as React.CSSProperties : {}),
            }}
          />
        );
      })}
    </div>
  );
}
