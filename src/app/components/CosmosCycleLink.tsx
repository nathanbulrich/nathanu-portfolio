"use client";

import { useEffect, useState } from "react";
import { useDialKit } from "dialkit";
import { useReducedMotion } from "motion/react";
import { DOT_COLORS } from "../lib/theme-definitions";

const HOVER_COLORS = DOT_COLORS.flatMap(({ name, hex }) => {
  if (name === "yellow") return [];
  if (name === "red") return [hex, "#bd5429"]; // Orange
  if (name === "blue") return [hex, "#8051ce"]; // Violet
  return [hex];
});

export default function CosmosCycleLink() {
  const {
    "Start delay (ms)": startDelay,
    "Color hold (ms)": colorHold,
    "Blend time (ms)": blendTime,
    "Loop pause (ms)": loopPause,
    "Return time (ms)": returnTime,
  } = useDialKit("Cosmos link colors", {
    "Start delay (ms)": [0, 0, 800, 10],
    "Color hold (ms)": [80, 20, 500, 5],
    "Blend time (ms)": [40, 0, 250, 5],
    "Loop pause (ms)": [80, 0, 800, 10],
    "Return time (ms)": [180, 0, 800, 10],
  }, { id: "cosmos-link-colors" });
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!hovered || reduceMotion) return;

    let timer: ReturnType<typeof setTimeout>;
    let nextIndex = 0;
    const advance = () => {
      const currentIndex = nextIndex;
      setColorIndex(currentIndex);
      nextIndex = (currentIndex + 1) % HOVER_COLORS.length;
      const pause = nextIndex === 0 ? loopPause : 0;
      timer = setTimeout(advance, blendTime + colorHold + pause);
    };

    timer = setTimeout(advance, startDelay);
    return () => clearTimeout(timer);
  }, [hovered, reduceMotion, startDelay, colorHold, blendTime, loopPause]);

  return (
    <a
      href="https://www.cosmos.so/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setColorIndex(null);
      }}
      style={{
        color: reduceMotion || colorIndex === null ? "var(--theme-text)" : HOVER_COLORS[colorIndex],
        transition: reduceMotion ? "none" : `color ${hovered ? blendTime : returnTime}ms linear`,
      }}
    >
      Cosmos
    </a>
  );
}
