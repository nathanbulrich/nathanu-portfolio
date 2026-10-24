"use client";

import { DOT_COLORS } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotStyle } from "../lib/DotStyleContext";

interface DotRowProps {
  dotSize: string;
  gap: string;
  className?: string;
}

export default function DotRow({ dotSize, gap, className = "" }: DotRowProps) {
  const { activeTheme, setTheme } = useTheme();
  const { ringThickness, ringSpacing, blackDotColor } = useDotStyle();
  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {DOT_COLORS.map(({ name, hex }) => {
        const color = name === "neutral" ? blackDotColor : hex;
        const isSelected = activeTheme === name;

        return (
          <button
            key={name}
            type="button"
            aria-label={`Set ${name} theme`}
            aria-pressed={isSelected}
            onClick={() => setTheme(name)}
            className={`${dotSize} rounded-full transition-transform duration-150 ease-out hover:scale-125 cursor-pointer border-0 p-0`}
            style={{
              backgroundColor: color,
              color,
              outlineColor: color,
              boxShadow: isSelected && ringThickness > 0
                ? `0 0 0 ${ringSpacing}px var(--theme-bg), 0 0 0 ${ringSpacing + ringThickness}px ${color}`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
