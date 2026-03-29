"use client";

import { DOT_COLORS, type ThemeColorName } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotAnimation } from "../lib/DotAnimationContext";

export type DotAnimationStyle = "bounce" | "spin" | "pop" | "flip" | "flip-back";

const STAGGER_STEP = 0.12; // seconds between each dot
const DOT_COUNT = DOT_COLORS.length;

interface DotRowProps {
  dotSize: string;
  gap: string;
  className?: string;
}

export default function DotRow({ dotSize, gap, className = "" }: DotRowProps) {
  const { activeTheme, setTheme } = useTheme();
  const { animation, cycle, reverseStagger } = useDotAnimation();

  const animClass = `dot-anim-${animation}`;

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {DOT_COLORS.map(({ name, hex }, i) => {
        const isSelected = activeTheme === name;
        const staggerDelay = reverseStagger
          ? (DOT_COUNT - 1 - i) * STAGGER_STEP
          : i * STAGGER_STEP;

        return (
          <button
            key={`${name}-${cycle}`}
            type="button"
            aria-label={`Set ${name} theme`}
            aria-pressed={isSelected}
            onClick={() => setTheme(name)}
            className={`${dotSize} rounded-full transition-transform duration-150 ease-out hover:scale-125 cursor-pointer border-0 p-0 ${animClass} ${
              isSelected ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              backgroundColor: hex,
              color: hex,
              outlineColor: hex,
              animationDelay: `${staggerDelay}s`,
              ...(isSelected ? { "--tw-ring-color": hex, "--tw-ring-offset-color": "var(--theme-bg)" } as React.CSSProperties : {}),
            }}
          />
        );
      })}
    </div>
  );
}
