"use client";

import { useCallback, useEffect, useRef } from "react";
import { DOT_COLORS } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotAnimation } from "../lib/DotAnimationContext";

export type DotAnimationStyle = "bounce" | "spin" | "pop" | "flip" | "flip-back";

const STAGGER_STEP = 0.12; // seconds between each dot
const DOT_COUNT = DOT_COLORS.length;
const SETTLE_DURATION = "400ms";

interface DotRowProps {
  dotSize: string;
  gap: string;
  className?: string;
}

export default function DotRow({ dotSize, gap, className = "" }: DotRowProps) {
  const { activeTheme, setTheme } = useTheme();
  const { animation, cycle, reverseStagger, paused, setHovering } = useDotAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPausedRef = useRef(paused);

  const animClass = `dot-anim-${animation}`;

  // Smoothly settle dots back to rest when pausing
  useEffect(() => {
    const wasPaused = prevPausedRef.current;
    prevPausedRef.current = paused;

    if (paused && !wasPaused && containerRef.current) {
      const buttons = Array.from(
        containerRef.current.querySelectorAll<HTMLButtonElement>("button")
      );

      buttons.forEach((btn) => {
        // Capture the current animated transform
        const currentTransform = getComputedStyle(btn).transform;
        // Kill the CSS animation
        btn.style.animation = "none";
        // Hold at captured position (prevents snap)
        btn.style.transform = currentTransform;
        // Use a longer transition for a calm return
        btn.style.transitionDuration = SETTLE_DURATION;
      });

      // Next frame: release transforms — CSS transition animates back to rest
      // (hovered dot will transition to its hover:scale-125 state)
      requestAnimationFrame(() => {
        buttons.forEach((btn) => {
          btn.style.transform = "";
        });
      });
    }
    // No cleanup needed on unpause — buttons remount (key includes cycle)
  }, [paused]);

  const onMouseEnter = useCallback(() => setHovering(true), [setHovering]);
  const onMouseLeave = useCallback(() => setHovering(false), [setHovering]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center ${gap} ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
              ...(isSelected
                ? ({
                    "--tw-ring-color": hex,
                    "--tw-ring-offset-color": "var(--theme-bg)",
                  } as React.CSSProperties)
                : {}),
            }}
          />
        );
      })}
    </div>
  );
}
