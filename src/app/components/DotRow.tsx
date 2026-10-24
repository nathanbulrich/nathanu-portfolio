"use client";

import { useEffect, useRef, useState } from "react";
import { paletteFromHue } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotStyle } from "../lib/DotStyleContext";

interface DotRowProps {
  dotSize: string;
  gap: string;
  className?: string;
}

export default function DotRow({ dotSize, gap, className = "" }: DotRowProps) {
  const { activeTheme, setTheme, dots, previewHue, addColor } = useTheme();
  const { ringThickness, ringSpacing, blackDotColor, ringDuration } = useDotStyle();
  const [editing, setEditing] = useState(false);
  const [hue, setHue] = useState(210);
  const sliderRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = dots.findIndex(({ name }) => name === activeTheme);
  const selectedColor = activeTheme === "neutral"
    ? blackDotColor
    : dots[selectedIndex].hex;
  const position = (selectedIndex / (dots.length - 1)) * 100;

  useEffect(() => {
    if (!editing) return;
    sliderRef.current?.focus();
    return () => previewHue(null);
  }, [editing, previewHue]);

  const finish = (save: boolean) => {
    if (save) addColor(hue);
    else previewHue(null);
    setEditing(false);
    addButtonRef.current?.focus();
  };

  return (
    <div className={`flex ${className}`}>
      <div
        className={`relative flex items-center ${gap}`}
        onKeyDown={(event) => {
          if (!editing) return;
          if (event.key === "Escape") {
            event.preventDefault();
            finish(false);
          } else if (event.key === "Enter" && event.target === sliderRef.current) {
            event.preventDefault();
            finish(true);
          }
        }}
      >
        <div className={`relative flex items-center ${gap}`}>
          <span
            aria-hidden="true"
            className={`${dotSize} pointer-events-none absolute top-0 rounded-full transition-[left,translate,box-shadow,opacity] ease-in-out motion-reduce:transition-none`}
            style={{
              left: `${position}%`,
              translate: `${-position}% 0`,
              transitionDuration: `${ringDuration}ms`,
              boxShadow: `0 0 0 ${ringSpacing}px var(--theme-bg), 0 0 0 ${ringSpacing + ringThickness}px ${selectedColor}`,
              visibility: ringThickness > 0 ? "visible" : "hidden",
              opacity: editing ? 0 : 1,
            }}
          />
          {dots.map(({ name, hex }, index) => {
            const color = name === "neutral" ? blackDotColor : hex;
            const isSelected = activeTheme === name;
            const isCancel = editing && name === "neutral";

            return (
              <button
                key={name}
                type="button"
                aria-label={isCancel ? "Cancel color selection" : name.startsWith("custom-") ? `Set custom color ${index - 6} theme` : `Set ${name} theme`}
                aria-pressed={isCancel ? undefined : isSelected}
                disabled={editing && !isCancel}
                onClick={() => isCancel ? finish(false) : setTheme(name)}
                className={`${dotSize} relative flex items-center justify-center shrink-0 rounded-full transition-[transform,opacity,background-color] duration-200 ease-out motion-reduce:transition-none ${isSelected || isCancel ? "" : "hover:scale-125"} cursor-pointer border-0 p-0`}
                style={{
                  backgroundColor: isCancel ? "transparent" : color,
                  color: "var(--theme-text-secondary)",
                  outlineColor: color,
                  opacity: editing && !isCancel ? 0 : 1,
                  transform: editing && !isCancel ? "scale(0.6)" : undefined,
                }}
              >
                {name === "neutral" && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-full w-full transition-[opacity,transform] duration-300 motion-reduce:transition-none"
                    style={{ opacity: isCancel ? 1 : 0, transform: isCancel ? "rotate(0deg)" : "rotate(-90deg) scale(0.5)" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  >
                    <path d="M3 3l10 10M13 3 3 13" />
                  </svg>
                )}
              </button>
            );
          })}
          <div
            aria-hidden={!editing}
            inert={!editing}
            className={`pointer-events-none absolute inset-0 grid ${gap}`}
            style={{ gridTemplateColumns: `repeat(${dots.length}, minmax(0, 1fr))` }}
          >
            <div
              className="relative origin-right rounded-full transition-[clip-path,opacity] duration-300 ease-in-out motion-reduce:transition-none"
              style={{
                gridColumn: "2 / -1",
                clipPath: editing ? "inset(-10px -10px -10px -10px round 999px)" : "inset(0 0 0 100% round 999px)",
                opacity: editing ? 1 : 0,
                pointerEvents: editing ? "auto" : "none",
              }}
            >
              <input
                ref={sliderRef}
                type="range"
                min={0}
                max={360}
                step={1}
                value={hue}
                aria-label="New theme color"
                aria-valuetext={`${hue} degrees hue`}
                onChange={(event) => {
                  const nextHue = Number(event.target.value);
                  setHue(nextHue);
                  previewHue(nextHue);
                }}
                className="theme-color-gradient absolute inset-0 h-full w-full cursor-ew-resize rounded-full"
              />
            </div>
          </div>
        </div>
        <button
          ref={addButtonRef}
          type="button"
          aria-label={editing ? "Add selected color" : "Add a theme color"}
          title={editing ? "Add selected color" : "Add a theme color"}
          onClick={() => {
            if (editing) finish(true);
            else {
              setEditing(true);
              previewHue(hue);
            }
          }}
          className={`${dotSize} flex shrink-0 items-center justify-center ${editing ? "rounded-full border border-current" : "border-0"} p-0 cursor-pointer transition-[color,background-color,transform] duration-200 hover:scale-110 motion-reduce:transition-none`}
          style={{
            color: editing ? "var(--theme-bg)" : "var(--theme-text-secondary)",
            backgroundColor: editing ? paletteFromHue(hue).text : "transparent",
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className={editing ? "h-[70%] w-[70%]" : "h-full w-full"} fill="none" stroke="currentColor" strokeWidth={editing ? 1.5 : 1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d={editing ? "M3 8l3 3 7-7" : "M8 2v12M2 8h12"} />
          </svg>
        </button>
      </div>
    </div>
  );
}
