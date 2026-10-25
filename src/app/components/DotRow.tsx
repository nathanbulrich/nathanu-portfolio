"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { animate, AnimatePresence, motion, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { DOT_COLORS, SPECTRUM_GRADIENT, paletteFromHue } from "../lib/theme-definitions";
import { useTheme } from "../lib/ThemeContext";
import { useDotStyle } from "../lib/DotStyleContext";

interface DotRowProps {
  className?: string;
}

type SavePhase = "idle" | "closing" | "spacing" | "revealing";

export default function DotRow({ className = "" }: DotRowProps) {
  const { activeTheme, setTheme, dots, previewHue, addColor } = useTheme();
  const { ringThickness, ringSpacing, ringDuration, morphDuration, defaultDotSize, dotSpacing, selectionBarHeight, springBounce, selectorDotSize, selectorStrokeWidth, selectorDelay, checkButtonGap } = useDotStyle();
  const { plusIconSize, plusIconStrokeWidth, checkIconSize, checkIconStrokeWidth } = useDotStyle();
  const { selectorDragScale, selectorDragDuration, selectorMoveDuration } = useDotStyle();
  const { addColorSpaceDuration, newColorPopDuration } = useDotStyle();
  // For an even count, use the right-hand middle dot.
  const originIndex = Math.floor(dots.length / 2);
  const originLeft = originIndex * (defaultDotSize + dotSpacing);
  const trackWidth = dots.length * defaultDotSize + (dots.length - 1) * dotSpacing;
  const originColor = dots[originIndex].hex;
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const [morphVisible, setMorphVisible] = useState(false);
  const [draggingSelector, setDraggingSelector] = useState(false);
  const [hue, setHue] = useState(180);
  const [savePhase, setSavePhase] = useState<SavePhase>("idle");
  const savePhaseRef = useRef<SavePhase>("idle");
  const pendingHue = useRef<number | null>(null);
  const closeComplete = useRef({ bar: false, button: false, icon: false });
  const saving = savePhase !== "idle";
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
  const hueAnimation = useRef<AnimationPlaybackControls | null>(null);
  const targetHue = useRef(180);
  const pointerStart = useRef<{ id: number; x: number; moved: boolean } | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = dots.findIndex(({ name }) => name === activeTheme);
  const selectedColor = dots[selectedIndex]?.hex ?? "transparent";
  const position = (Math.max(0, selectedIndex) / (dots.length - 1)) * 100;

  const selectHue = (nextHue: number, smooth: boolean) => {
    hueAnimation.current?.stop();
    targetHue.current = nextHue;
    const update = (value: number) => {
      setHue(value);
      previewHue(value);
    };
    if (smooth && !reduceMotion) {
      hueAnimation.current = animate(hue, nextHue, {
        duration: selectorMoveDuration / 1000,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: update,
      });
    } else update(nextHue);
  };

  const hueAtPointer = (input: HTMLInputElement, clientX: number) => {
    const bounds = input.getBoundingClientRect();
    const travel = Math.max(1, bounds.width - selectorDotSize);
    return Math.round(Math.max(0, Math.min(1, (clientX - bounds.left - selectorDotSize / 2) / travel)) * 360);
  };

  const releaseSelector = () => {
    pointerStart.current = null;
    setDraggingSelector(false);
  };

  useEffect(() => () => {
    hueAnimation.current?.stop();
    previewHue(null);
  }, [previewHue]);

  const advanceAfterClose = (part: "bar" | "button" | "icon") => {
    if (savePhaseRef.current !== "closing") return;
    closeComplete.current[part] = true;
    if (Object.values(closeComplete.current).every(Boolean)) {
      savePhaseRef.current = "spacing";
      setSavePhase("spacing");
    }
  };

  const revealNewColor = () => {
    if (savePhaseRef.current !== "spacing" || pendingHue.current === null) return;
    savePhaseRef.current = "revealing";
    setSavePhase("revealing");
    addColor(pendingHue.current);
  };

  const finishReveal = () => {
    if (savePhaseRef.current !== "revealing") return;
    pendingHue.current = null;
    savePhaseRef.current = "idle";
    setSavePhase("idle");
    addButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!editing) return;
    sliderRef.current?.focus();
    const cancelOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !componentRef.current?.contains(event.target)) {
        hueAnimation.current?.stop();
        pointerStart.current = null;
        setEditing(false);
        setDraggingSelector(false);
        previewHue(null);
      }
    };
    document.addEventListener("pointerdown", cancelOutside, true);
    return () => {
      document.removeEventListener("pointerdown", cancelOutside, true);
    };
  }, [editing, previewHue]);

  const finish = (save: boolean) => {
    if (savePhaseRef.current !== "idle") return;
    hueAnimation.current?.stop();
    pointerStart.current = null;
    if (save && !reduceMotion) {
      pendingHue.current = targetHue.current;
      closeComplete.current = { bar: false, button: false, icon: false };
      savePhaseRef.current = "closing";
      setSavePhase("closing");
      previewHue(targetHue.current);
    } else if (save) addColor(targetHue.current);
    else previewHue(null);
    setEditing(false);
    setDraggingSelector(false);
    addButtonRef.current?.focus();
  };

  return (
    <div className={`flex ${className}`}>
      <div
        ref={componentRef}
        data-save-phase={savePhase}
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
          <motion.span
            key={`${dots.length}-${selectedIndex >= 0}`}
            data-selection-ring="true"
            aria-hidden="true"
            initial={savePhase === "revealing" ? { scale: 0.5, opacity: 0 } : false}
            animate={{ scale: 1, opacity: editing || (saving && savePhase !== "revealing") ? 0 : 1 }}
            transition={{ duration: reduceMotion ? 0 : newColorPopDuration / 1000, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-none absolute top-0 rounded-full transition-[left,translate,box-shadow] ease-in-out motion-reduce:transition-none`}
            style={{
              ...dotDimensions,
              left: `${position}%`,
              translate: `${-position}% 0`,
              transitionDuration: `${ringDuration}ms`,
              boxShadow: `0 0 0 ${ringSpacing}px var(--theme-bg), 0 0 0 ${ringSpacing + ringThickness}px ${selectedColor}`,
              visibility: selectedIndex >= 0 && ringThickness > 0 ? "visible" : "hidden",
            }}
          />
          {dots.map(({ name, hex }, index) => {
            const color = hex;
            const isSelected = activeTheme === name;
            const isNewColor = savePhase === "revealing" && index === dots.length - 1;

            return (
              <button
                key={name}
                data-theme-dot={name}
                type="button"
                aria-label={name.startsWith("custom-") ? `Set custom color ${index - DOT_COLORS.length + 1} theme` : `Set ${name} theme`}
                aria-pressed={isSelected}
                disabled={editing || saving}
                onClick={() => setTheme(name)}
                className={`relative flex items-center justify-center shrink-0 rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${isSelected || editing || saving ? "" : "hover:scale-125"} cursor-pointer border-0 p-0`}
                style={{
                  ...dotDimensions,
                  color: "var(--theme-text-secondary)",
                  outlineColor: color,
                }}
              >
                <motion.span
                  aria-hidden="true"
                  initial={isNewColor ? { scale: 0.5, opacity: 0 } : false}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ scale: 1, opacity: editing ? 0 : 1 }}
                  transition={isNewColor
                    ? { duration: reduceMotion ? 0 : newColorPopDuration / 1000, ease: [0.22, 1, 0.36, 1] }
                    : { duration: reduceMotion ? 0 : morphDuration / 2500 }}
                  onAnimationComplete={isNewColor ? finishReveal : undefined}
                />
              </button>
            );
          })}
          {savePhase === "spacing" && (
            <motion.span
              aria-hidden="true"
              data-new-color-space="true"
              className="shrink-0"
              style={{ marginLeft: -dotSpacing, height: defaultDotSize }}
              initial={{ width: 0 }}
              animate={{ width: defaultDotSize + dotSpacing }}
              transition={{ duration: reduceMotion ? 0 : addColorSpaceDuration / 1000, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={revealNewColor}
            />
          )}
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
              if (!editing) {
                setMorphVisible(false);
                advanceAfterClose("bar");
              }
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
                  "--selector-drag-scale": editing && draggingSelector ? selectorDragScale : 1,
                  opacity: editing ? 1 : 0,
                }}
                transition={{
                  ...morphTransition,
                  delay: editing && !reduceMotion ? selectorDelay / 1000 : 0,
                  "--selector-drag-scale": reduceMotion
                    ? { duration: 0, delay: 0 }
                    : { type: "spring", visualDuration: selectorDragDuration / 1000, bounce: 0, delay: 0 },
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
                aria-valuetext={`${Math.round(hue)} degrees hue`}
                onPointerDown={(event) => {
                  if (!event.isPrimary || event.button !== 0) return;
                  event.preventDefault();
                  event.currentTarget.focus();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  pointerStart.current = { id: event.pointerId, x: event.clientX, moved: false };
                  setDraggingSelector(true);
                  selectHue(hueAtPointer(event.currentTarget, event.clientX), true);
                }}
                onPointerMove={(event) => {
                  const pointer = pointerStart.current;
                  if (!pointer || pointer.id !== event.pointerId) return;
                  if (Math.abs(event.clientX - pointer.x) > 3) pointer.moved = true;
                  if (pointer.moved) selectHue(hueAtPointer(event.currentTarget, event.clientX), false);
                }}
                onPointerUp={releaseSelector}
                onPointerCancel={releaseSelector}
                onLostPointerCapture={releaseSelector}
                onBlur={releaseSelector}
                onChange={(event) => {
                  selectHue(Number(event.target.value), false);
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
              backgroundColor: editing ? "#000000" : "rgba(0, 0, 0, 0)",
            }}
            whileHover={editing ? {
              backgroundColor: "#1a1a1a",
              transition: { duration: reduceMotion ? 0 : 0.15 },
            } : {}}
            transition={morphTransition}
            onAnimationComplete={() => {
              if (!editing) advanceAfterClose("button");
            }}
            type="button"
            aria-disabled={saving}
            aria-label={editing ? "Add selected color" : "Add a theme color"}
            title={editing ? "Add selected color" : "Add a theme color"}
            onClick={() => {
              if (savePhaseRef.current !== "idle") return;
              if (editing) finish(true);
              else {
                hueAnimation.current?.stop();
                targetHue.current = 180;
                setHue(180);
                setMorphVisible(true);
                setEditing(true);
                previewHue(180);
              }
            }}
            className="group absolute flex items-center justify-center rounded-full border-0 p-0 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              color: editing ? "#ffffff" : "var(--theme-text-secondary)",
            }}
          >
            <span className={`flex items-center justify-center transition-transform duration-150 ease-out ${editing || saving ? "" : "group-hover:scale-125"} motion-reduce:transition-none`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.svg
                  key={editing ? "check" : "plus"}
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  style={{
                    width: editing ? checkIconSize : plusIconSize,
                    height: editing ? checkIconSize : plusIconSize,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onAnimationComplete={() => {
                    if (!editing) advanceAfterClose("icon");
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.12, ease: "easeInOut" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={editing ? checkIconStrokeWidth : plusIconStrokeWidth}
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                >
                  <path vectorEffect="non-scaling-stroke" d={editing ? "M2 8L6 12L14 4" : "M8 2L8 14M2 8L14 8"} />
                </motion.svg>
              </AnimatePresence>
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
