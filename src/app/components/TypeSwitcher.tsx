"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useDialKit } from "dialkit";
import { useTypeStyle } from "../lib/TypeStyleContext";

const styles = [
  { key: "serif" as const, font: "Georgia, serif", label: "Georgia" },
  { key: "mono" as const, font: "'Berkeley Mono', monospace", label: "Berkeley Mono" },
  { key: "sans" as const, font: "'Inter', sans-serif", label: "Inter" },
];

export default function TypeSwitcher() {
  const { typeStyle, setTypeStyle } = useTypeStyle();
  const reducedMotion = useReducedMotion();
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const values = useDialKit("Type segmented control", {
    layout: {
      segmentWidth: [38, 28, 48, 1],
      segmentHeight: [38, 28, 56, 1],
      padding: [3, 0, 8, 1],
      gap: [2, 0, 8, 1],
    },
    container: {
      radius: [30, 0, 30, 1],
      tint: [2, 0, 25, 1],
      borderWidth: [1, 0, 3, 0.25],
      borderOpacity: [4, 0, 50, 1],
    },
    selected: {
      radius: [24, 0, 24, 1],
      tint: [0, 0, 25, 1],
      borderOpacity: [4, 0, 50, 1],
      shadowOpacity: [3, 0, 40, 1],
      shadowBlur: [1, 0, 16, 0.5],
      shadowY: [1, 0, 8, 0.5],
    },
    typography: {
      serifSize: [19, 14, 28, 0.25],
      monoSize: [21.5, 14, 28, 0.25],
      sansSize: [19, 14, 28, 0.25],
      inactiveOpacity: [40, 10, 100, 1],
      activeOpacity: [100, 40, 100, 1],
    },
    interaction: {
      hoverTint: [3, 0, 20, 1],
      hoverCircleSize: [36, 16, 48, 1],
      slideStiffness: [400, 100, 900, 10],
      slideDamping: [28, 10, 60, 1],
      zoomStiffness: [500, 100, 900, 10],
      zoomDamping: [20, 10, 60, 1],
      hoverScale: [1.04, 1, 1.2, 0.01],
      duration: [100, 0, 400, 10],
    },
  }, { id: "type-segmented-control", persist: true });
  const tint = (amount: number) => `color-mix(in srgb, var(--theme-text) ${amount}%, transparent)`;

  return (
    <div
      data-text-transition-ignore
      role="group"
      aria-label="Typeface"
      className="relative inline-flex self-start"
      style={{
        padding: values.layout.padding,
        gap: values.layout.gap,
        borderRadius: values.container.radius,
        background: tint(values.container.tint),
        border: `${values.container.borderWidth}px solid ${tint(values.container.borderOpacity)}`,
      }}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: styles.findIndex(({ key }) => key === typeStyle) * (values.layout.segmentWidth + values.layout.gap) }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: values.interaction.slideStiffness, damping: values.interaction.slideDamping }}
        className="absolute pointer-events-none"
        style={{
          left: values.layout.padding,
          top: values.layout.padding,
          width: values.layout.segmentWidth,
          height: values.layout.segmentHeight,
          borderRadius: values.selected.radius,
          background: `color-mix(in srgb, var(--theme-text) ${values.selected.tint}%, var(--theme-bg))`,
          boxShadow: `inset 0 0 0 1px ${tint(values.selected.borderOpacity)}, 0 ${values.selected.shadowY}px ${values.selected.shadowBlur}px rgba(0,0,0,${values.selected.shadowOpacity / 100})`,
        }}
      />
      {styles.map(({ key, font, label }) => {
        const active = typeStyle === key;
        return (
          <button
            key={key}
            onClick={() => setTypeStyle(key)}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setHoveredType(key);
            }}
            onPointerLeave={() => setHoveredType(null)}
            onPointerCancel={() => setHoveredType(null)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className="type-segment flex items-center justify-center cursor-pointer relative motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              width: values.layout.segmentWidth,
              height: values.layout.segmentHeight,
              borderRadius: values.selected.radius,
              fontFamily: font,
              fontSize: values.typography[`${key}Size`],
              transitionDuration: `${values.interaction.duration}ms`,
              '--segment-duration': `${values.interaction.duration}ms`,
            } as React.CSSProperties}
          >
            <span aria-hidden="true" className="absolute rounded-full type-segment-hover pointer-events-none" style={{ opacity: hoveredType === key && !active ? 1 : 0, backgroundColor: tint(values.interaction.hoverTint), width: Math.min(values.interaction.hoverCircleSize, values.layout.segmentWidth, values.layout.segmentHeight), height: Math.min(values.interaction.hoverCircleSize, values.layout.segmentWidth, values.layout.segmentHeight) }} />
            <motion.span
              className="relative"
              initial={false}
              animate={{ scale: !reducedMotion && hoveredType === key && !active ? values.interaction.hoverScale : 1 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: values.interaction.zoomStiffness, damping: values.interaction.zoomDamping }}
              style={{ opacity: (active ? values.typography.activeOpacity : values.typography.inactiveOpacity) / 100 }}
            >A</motion.span>
          </button>
        );
      })}
    </div>
  );
}
