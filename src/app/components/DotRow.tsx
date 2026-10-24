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
  const { ringThickness, ringSpacing, blackDotColor, ringDuration } = useDotStyle();
  const selectedIndex = DOT_COLORS.findIndex(({ name }) => name === activeTheme);
  const selectedColor = activeTheme === "neutral"
    ? blackDotColor
    : DOT_COLORS[selectedIndex].hex;
  const position = (selectedIndex / (DOT_COLORS.length - 1)) * 100;

  return (
    <div className={`flex ${className}`}>
      <div className={`relative flex items-center ${gap}`}>
        <span
          aria-hidden="true"
          className={`${dotSize} pointer-events-none absolute top-0 rounded-full transition-[left,translate,box-shadow] ease-in-out motion-reduce:transition-none`}
          style={{
            left: `${position}%`,
            translate: `${-position}% 0`,
            transitionDuration: `${ringDuration}ms`,
            boxShadow: `0 0 0 ${ringSpacing}px var(--theme-bg), 0 0 0 ${ringSpacing + ringThickness}px ${selectedColor}`,
            visibility: ringThickness > 0 ? "visible" : "hidden",
          }}
        />
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
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
