"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPECTRUM_GRADIENT } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotStyle } from "../lib/DotStyleContext";

interface DotRowProps {
  className?: string;
}

export default function DotRow({ className = "" }: DotRowProps) {
  const { activeTheme, setTheme, dots, previewHue, addColor } = useTheme();
  const { ringThickness, ringSpacing, blackDotColor, ringDuration, morphDuration, defaultDotSize, dotSpacing, animationOrigin, selectionBarHeight, springBounce, selectorDotSize, selectorStrokeWidth } = useDotStyle();
  const originIndex = Math.max(0, Math.min(dots.length - 1, Number(animationOrigin) || 0));
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [hue, setHue] = useState(210);
  const [trackBounds, setTrackBounds] = useState({ width: 0, originLeft: 0 });
  const dotDimensions = { width: defaultDotSize, height: defaultDotSize };
  const barHeight = editing ? selectionBarHeight : defaultDotSize;
  const barTop = (defaultDotSize - barHeight) / 2;
  const morphTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, visualDuration: morphDuration / 1000, bounce: springBounce };
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
      const originDot = track.querySelectorAll<HTMLButtonElement>("[data-theme-dot]")[originIndex];
      if (!originDot) return;
      setTrackBounds({ width: track.clientWidth, originLeft: originDot.offsetLeft });
      track.style.setProperty("--spectrum-width", `${track.clientWidth}px`);
    };
    const observer = new ResizeObserver(syncBounds);
    observer.observe(track);
    return () => observer.disconnect();
  }, [originIndex]);

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
        className="relative flex items-center"
        style={{ gap: dotSpacing }}
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
        <div ref={dotTrackRef} className="relative flex items-center" style={{ gap: dotSpacing }}>
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 rounded-full transition-[left,translate,box-shadow,opacity] ease-in-out motion-reduce:transition-none`}
            style={{
              ...dotDimensions,
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
            const isOrigin = index === originIndex;

            return (
              <button
                key={name}
                data-theme-dot={name}
                type="button"
                aria-label={name.startsWith("custom-") ? `Set custom color ${index - 6} theme` : `Set ${name} theme`}
                aria-pressed={isSelected}
                disabled={editing}
                onClick={() => setTheme(name)}
                className={`relative flex items-center justify-center shrink-0 rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${isSelected || editing ? "" : "hover:scale-125"} cursor-pointer border-0 p-0`}
                style={{
                  ...dotDimensions,
                  color: "var(--theme-text-secondary)",
                  outlineColor: color,
                  zIndex: isOrigin ? 1 : undefined,
                }}
              >
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  className="pointer-events-none absolute overflow-hidden rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{
                    left: editing && isOrigin ? -trackBounds.originLeft : 0,
                    right: editing && isOrigin ? -(trackBounds.width - trackBounds.originLeft - defaultDotSize) : 0,
                    top: isOrigin ? barTop : 0,
                    height: isOrigin ? barHeight : defaultDotSize,
                    opacity: editing && !isOrigin ? 0 : 1,
                  }}
                  transition={{
                    ...morphTransition,
                    opacity: { duration: reduceMotion ? 0 : morphDuration / 2500 },
                  }}
                >
                  {isOrigin && (
                    <>
                      <span
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: "var(--spectrum-width)",
                          backgroundColor: color,
                          backgroundImage: SPECTRUM_GRADIENT,
                          backgroundSize: "100% 100%",
                          backgroundPosition: "left center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <motion.span
                        className="absolute inset-0"
                        style={{ backgroundColor: color }}
                        initial={false}
                        animate={{ opacity: editing ? 0 : 1 }}
                        transition={{
                          duration: editing || reduceMotion ? 0 : 0.1,
                          delay: editing || reduceMotion ? 0 : morphDuration / 1000,
                        }}
                      />
                    </>
                  )}
                </motion.span>
              </button>
            );
          })}
          <motion.div
            initial={false}
            animate={{ top: barTop, height: barHeight }}
            transition={morphTransition}
            aria-hidden={!editing}
            inert={!editing}
            className="pointer-events-none absolute left-0 right-0 z-10 grid"
            style={{ gap: dotSpacing, gridTemplateColumns: `repeat(${dots.length}, minmax(0, 1fr))` }}
          >
            <div
              className="relative rounded-full transition-opacity ease-in-out motion-reduce:transition-none"
              style={{
                gridColumn: "1 / -1",
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
                style={{
                  "--theme-color-thumb-size": `${selectorDotSize}px`,
                  "--theme-color-thumb-stroke": `${Math.min(selectorStrokeWidth, selectorDotSize / 2)}px`,
                } as CSSProperties}
              />
            </div>
          </motion.div>
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
          className={`flex shrink-0 items-center justify-center border-0 bg-transparent p-0 cursor-pointer transition-[color,transform] duration-200 hover:scale-110 motion-reduce:transition-none`}
          style={{
            ...dotDimensions,
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
