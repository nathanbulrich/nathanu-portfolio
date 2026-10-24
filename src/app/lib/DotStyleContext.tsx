"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { useTheme } from "./ThemeContext";

const DotStyleContext = createContext({
  animationOrigin: "1",
  defaultDotSize: 16,
  dotSpacing: 14,
  selectionBarHeight: 32,
  selectorDotSize: 16,
  selectorStrokeWidth: 2,
  springBounce: 0.3,
  ringThickness: 2,
  ringSpacing: 2,
  ringDuration: 320,
  morphDuration: 480,
  blackDotColor: "#000000",
});

export function DotStyleProvider({ children }: { children: ReactNode }) {
  const { dots } = useTheme();
  const values = useDialKit("Theme dots", {
    animationOrigin: {
      type: "select",
      default: "1",
      options: dots.map(({ name }, index) => ({
        value: String(index),
        label: `${index + 1} — ${name === "neutral" ? "Black" : name.startsWith("custom-") ? "Custom color" : name.charAt(0).toUpperCase() + name.slice(1)}`,
      })),
    },
    defaultDotSize: [16, 8, 32, 1],
    dotSpacing: [14, 0, 32, 1],
    selectionBarHeight: [32, 16, 64, 1],
    selectorDotSize: [16, 8, 40, 1],
    selectorStrokeWidth: [2, 0, 6, 0.5],
    springBounce: [0.3, 0, 0.6, 0.05],
    ringThickness: [2, 0, 6, 0.5],
    ringSpacing: [2, 0, 8, 0.5],
    ringDuration: [320, 100, 800, 10],
    morphDuration: [480, 150, 1200, 10],
    blackDotColor: "#000000",
  }, { id: "theme-dots", persist: true });

  return (
    <DotStyleContext.Provider value={values}>
      {children}
      <DialRoot productionEnabled />
    </DotStyleContext.Provider>
  );
}

export function useDotStyle() {
  return useContext(DotStyleContext);
}
