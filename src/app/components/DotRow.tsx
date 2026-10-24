"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SPECTRUM_GRADIENT, paletteFromHue } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotStyle } from "../lib/DotStyleContext";

interface DotRowProps {
  className?: string;
}

export default function DotRow({ className = "" }: DotRowProps) {
  const { activeTheme, setTheme, dots, previewHue, addColor } = useTheme();
  const { ringThickness, ringSpacing, neutralDotColor, ringDuration, morphDuration, defaultDotSize, dotSpacing, selectionBarHeight, springBounce, selectorDotSize, selectorStrokeWidth, selectorDelay, checkButtonGap, checkBackgroundTint } = useDotStyle();
  // For an even count, use the right-hand middle dot.
  const originIndex = Math.floor(dots.length / 2);
  const originLeft = originIndex * (defaultDotSize + dotSpacing);
  const trackWidth = dots.length * defaultDotSize + (dots.length - 1) * dotSpacing;
  const originColor = dots[originIndex].name === "neutral" ? neutralDotColor : dots[originIndex].hex;
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [morphVisible, setMorphVisible] = useState(false);
  const [hue, setHue] = useState(0);
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
  const sliderRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = dots.findIndex(({ name }) => name === activeTheme);
  const selectedColor = activeTheme === "neutral"
    ? neutralDotColor
    : dots[selectedIndex]?.hex ?? "transparent";
  const position = (Math.max(0, selectedIndex) / (dots.length - 1)) * 100;

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
        <div className="relative flex items-center" style={{ gap: dotSpacing }}>
          {/* New dots get a fresh ring so their selection appears without sliding. */}
          <span
            key={`${dots.length}-${selectedIndex >= 0}`}
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 rounded-full transition-[left,translate,box-shadow,opacity] ease-in-out motion-reduce:transition-none`}
            style={{
              ...dotDimensions,
              left: `${position}%`,
              translate: `${-position}% 0`,
              transitionDuration: `${ringDuration}ms`,
              boxShadow: `0 0 0 ${ringSpacing}px var(--theme-bg), 0 0 0 ${ringSpacing + ringThickness}px ${selectedColor}`,
              visibility: selectedIndex >= 0 && ringThickness > 0 ? "visible" : "hidden",
              opacity: editing ? 0 : 1,
            }}
          />
          {dots.map(({ name, hex }, index) => {
            const color = name === "neutral" ? neutralDotColor : hex;
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
                className={`relative flex items-center justify-center shrink-0 rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${isSelected || editing ? "" : "hover:scale-125"} cursor-pointer border-0 p-0`}
                style={{
                  ...dotDimensions,
                  color: "var(--theme-text-secondary)",
                  outlineColor: color,
                }}
              >
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: editing ? 0 : 1 }}
                  transition={{ duration: reduceMotion ? 0 : morphDuration / 2500 }}
                />
              </button>
            );
          })}
          <motion.span
            data-color-morph="true"
            aria-hidden="true"
            initial={false}
            className="pointer-events-none absolute z-[1] overflow-hidden rounded-full"
            style={{ backgroundColor: originColor, visibility: morphVisible ? "visible" : "hidden" }}
            animate={{
              left: editing ? 0 : originLeft,
              width: editing ? trackWidth + barExtension : defaultDotSize,
              top: barTop,
              height: barHeight,
            }}
            transition={morphTransition}
            onAnimationComplete={() => {
              if (!editing) setMorphVisible(false);
            }}
          >
            <span
              className="absolute inset-y-0 left-0"
              style={{
                width: trackWidth + barExtension,
                backgroundColor: originColor,
                backgroundImage: SPECTRUM_GRADIENT,
                backgroundSize: "100% 100%",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <motion.span
              className="absolute inset-0"
              style={{ backgroundColor: originColor }}
              initial={false}
              animate={{ opacity: editing ? 0 : 1 }}
              transition={{
                duration: editing || reduceMotion ? 0 : 0.1,
                delay: editing || reduceMotion ? 0 : morphDuration / 1000,
              }}
            />
          </motion.span>
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
                  "--selector-scale": editing ? 1 : 0,
                  opacity: editing ? 1 : 0,
                }}
                transition={{
                  ...morphTransition,
                  delay: editing && !reduceMotion ? selectorDelay / 1000 : 0,
                  opacity: {
                    duration: reduceMotion ? 0 : 0.2,
                    delay: editing && !reduceMotion ? selectorDelay / 1000 : 0,
                  },
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
                  "--theme-color-thumb-color": paletteFromHue(hue).dot,
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
                setMorphVisible(true);
                setEditing(true);
                previewHue(0);
              }
            }}
            className="group absolute flex items-center justify-center rounded-full border-0 p-0 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              color: editing ? "var(--theme-text)" : "var(--theme-text-secondary)",
            }}
          >
            <span className="flex items-center justify-center transition-transform duration-150 ease-out group-hover:scale-125 motion-reduce:transition-none">
              <AnimatePresence mode="wait" initial={false}>
                <motion.svg
                  key={editing ? "check" : "plus"}
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  style={{
                    width: editing ? selectionBarHeight / 2 : defaultDotSize,
                    height: editing ? selectionBarHeight / 2 : defaultDotSize,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.12, ease: "easeInOut" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                >
                  <path d={editing ? "M2 8L6 12L14 4" : "M8 2L8 14M2 8L14 8"} />
                </motion.svg>
              </AnimatePresence>
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
