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
  const { ringThickness, ringSpacing, blackDotColor, ringDuration, morphDuration, defaultDotSize, dotSpacing, animationOrigin, selectionBarHeight, springBounce, selectorDotSize, selectorStrokeWidth, checkButtonGap, checkBackgroundTint } = useDotStyle();
  const originIndex = Math.max(0, Math.min(dots.length - 1, Number(animationOrigin) || 0));
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [selectorReady, setSelectorReady] = useState(false);
  const [hue, setHue] = useState(0);
  const [trackBounds, setTrackBounds] = useState({ width: 0, originLeft: 0 });
  const dotDimensions = { width: defaultDotSize, height: defaultDotSize };
  const barHeight = editing ? selectionBarHeight : defaultDotSize;
  const barExtension = dotSpacing + (defaultDotSize - selectionBarHeight) / 2 - checkButtonGap;
  const barTop = (defaultDotSize - barHeight) / 2;
  // Native range thumbs stop half a thumb-width inside the input.
  // Add the remaining inset so their centers meet the capsule end centers.
  const selectorInset = Math.max(0, (selectionBarHeight - selectorDotSize) / 2);
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
        setSelectorReady(false);
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
    setSelectorReady(false);
    setEditing(false);
    addButtonRef.current?.focus();
  };

  return (
    <div className={`flex ${className}`}>
      <div
        ref={componentRef}
        className="relative flex items-center"
        style={{ gap: dotSpacing, height: defaultDotSize }}
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
                  onAnimationComplete={() => {
                    if (isOrigin && editing) setSelectorReady(true);
                  }}
                  animate={{
                    left: editing && isOrigin ? -trackBounds.originLeft : 0,
                    right: editing && isOrigin ? -(trackBounds.width + barExtension - trackBounds.originLeft - defaultDotSize) : 0,
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
                          width: `calc(var(--spectrum-width) + ${barExtension}px)`,
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
            animate={{ top: barTop, height: barHeight, right: editing ? -barExtension : 0 }}
            transition={morphTransition}
            aria-hidden={!editing}
            inert={!editing}
            className="pointer-events-none absolute left-0 right-0 z-10 grid"
            style={{ gap: dotSpacing, gridTemplateColumns: `repeat(${dots.length}, minmax(0, 1fr))` }}
          >
            <div
              className="relative rounded-full"
              style={{
                gridColumn: "1 / -1",
                visibility: editing ? "visible" : "hidden",
                pointerEvents: editing ? "auto" : "none",
              }}
            >
              <motion.input
                ref={sliderRef}
                initial={false}
                animate={{
                  "--selector-scale": editing && selectorReady ? 1 : 0,
                  opacity: editing && selectorReady ? 1 : 0,
                }}
                transition={{
                  ...morphTransition,
                  opacity: { duration: reduceMotion ? 0 : 0.2 },
                }}
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
                  left: selectorInset,
                  right: selectorInset,
                  width: `calc(100% - ${selectorInset * 2}px)`,
                  "--theme-color-thumb-size": `${selectorDotSize}px`,
                  "--theme-color-thumb-stroke": `${selectorStrokeWidth}px`,
                } as CSSProperties}
              />
            </div>
          </motion.div>
        </div>
        <div className="relative shrink-0" style={dotDimensions}>
          <motion.button
            ref={addButtonRef}
            initial={false}
            animate={{
              width: editing ? selectionBarHeight : defaultDotSize,
              height: editing ? selectionBarHeight : defaultDotSize,
              backgroundColor: editing ? `hsl(${hue} 55% 40% / ${checkBackgroundTint / 100})` : "rgba(0, 0, 0, 0)",
            }}
            transition={morphTransition}
            type="button"
            aria-label={editing ? "Add selected color" : "Add a theme color"}
            title={editing ? "Add selected color" : "Add a theme color"}
            onClick={() => {
              if (editing) finish(true);
              else {
                setHue(0);
                setSelectorReady(false);
                setEditing(true);
                previewHue(0);
              }
            }}
            className="absolute flex items-center justify-center rounded-full border-0 p-0 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              color: editing ? "var(--theme-text)" : "var(--theme-text-secondary)",
            }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              style={{ width: editing ? "50%" : "100%", height: editing ? "50%" : "100%" }}
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
          </motion.button>
        </div>
      </div>
    </div>
  );
}
