"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPECTRUM_GRADIENT } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotStyle } from "../lib/DotStyleContext";

interface DotRowProps {
  dotSize: string;
  gap: string;
  className?: string;
}

export default function DotRow({ dotSize, gap, className = "" }: DotRowProps) {
  const { activeTheme, setTheme, dots, previewHue, addColor } = useTheme();
  const { ringThickness, ringSpacing, blackDotColor, ringDuration, morphDuration } = useDotStyle();
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [hue, setHue] = useState(210);
  const componentRef = useRef<HTMLDivElement>(null);
  const dotTrackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = dots.findIndex(({ name }) => name === activeTheme);
  const selectedColor = activeTheme === "neutral"
    ? blackDotColor
    : dots[selectedIndex].hex;
  const position = (selectedIndex / (dots.length - 1)) * 100;

  useEffect(() => {
    const track = dotTrackRef.current;
    if (!track) return;
    const syncBounds = () => {
      const redDot = track.querySelector<HTMLButtonElement>('[data-theme-dot="red"]');
      if (!redDot) return;
      track.style.setProperty("--spectrum-width", `${track.clientWidth}px`);
      track.style.setProperty("--dot-diameter", `${redDot.offsetWidth}px`);
      track.style.setProperty("--red-dot-left", `${redDot.offsetLeft}px`);
      track.style.setProperty("--red-dot-right", `${track.clientWidth - redDot.offsetLeft - redDot.offsetWidth}px`);
    };
    syncBounds();
    const observer = new ResizeObserver(syncBounds);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!editing) return;
    sliderRef.current?.focus();
    const cancelOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !componentRef.current?.contains(event.target)) {
        setEditing(false);
        previewHue(null);
      }
    };
    document.addEventListener("pointerdown", cancelOutside, true);
    return () => {
      document.removeEventListener("pointerdown", cancelOutside, true);
      previewHue(null);
    };
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
        ref={componentRef}
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
        <div ref={dotTrackRef} className={`relative flex items-center ${gap}`}>
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

            return (
              <button
                key={name}
                data-theme-dot={name}
                type="button"
                aria-label={name.startsWith("custom-") ? `Set custom color ${index - 6} theme` : `Set ${name} theme`}
                aria-pressed={isSelected}
                disabled={editing}
                onClick={() => setTheme(name)}
                className={`${dotSize} relative flex items-center justify-center shrink-0 rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${isSelected || editing ? "" : "hover:scale-125"} cursor-pointer border-0 p-0`}
                style={{
                  color: "var(--theme-text-secondary)",
                  outlineColor: color,
                  zIndex: name === "red" ? 1 : undefined,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 overflow-hidden rounded-full transition-[left,right,opacity] ease-in-out motion-reduce:transition-none"
                  style={{
                    backgroundColor: color,
                    left: editing && name === "red" ? "calc(-1 * var(--red-dot-left))" : 0,
                    right: editing && name === "red" ? "calc(-1 * var(--red-dot-right))" : 0,
                    opacity: editing && name !== "red" ? 0 : 1,
                    transitionDuration: `${reduceMotion ? 0 : name === "red" ? morphDuration : morphDuration * 0.4}ms`,
                  }}
                >
                  {name === "red" && (
                    <span
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: "var(--spectrum-width)",
                        backgroundColor: color,
                        backgroundImage: SPECTRUM_GRADIENT,
                        backgroundSize: "calc(100% - var(--dot-diameter)) 100%",
                        backgroundPosition: "right center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
          <div
            aria-hidden={!editing}
            inert={!editing}
            className={`pointer-events-none absolute inset-0 z-10 grid ${gap}`}
            style={{ gridTemplateColumns: `repeat(${dots.length}, minmax(0, 1fr))` }}
          >
            <div
              className="relative rounded-full transition-opacity ease-in-out motion-reduce:transition-none"
              style={{
                gridColumn: "1 / -1",
                marginLeft: "var(--dot-diameter)",
                transitionDuration: `${reduceMotion ? 0 : morphDuration * 0.35}ms`,
                transitionDelay: `${editing && !reduceMotion ? morphDuration : 0}ms`,
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
          className={`${dotSize} flex shrink-0 items-center justify-center border-0 bg-transparent p-0 cursor-pointer transition-[color,transform] duration-200 hover:scale-110 motion-reduce:transition-none`}
          style={{
            color: editing ? "var(--theme-text)" : "var(--theme-text-secondary)",
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <motion.path
              initial={false}
              animate={{ d: editing ? "M2 8L6 12M6 12L14 4" : "M8 2L8 14M2 8L14 8" }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
