"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";

const DotStyleContext = createContext({
  defaultDotSize: 16,
  dotSpacing: 14,
  selectionBarHeight: 32,
  checkButtonGap: 8,
  plusIconSize: 16,
  plusIconStrokeWidth: 1.7,
  checkIconSize: 16,
  checkIconStrokeWidth: 1.7,
  selectorDelay: 400,
  selectorDotSize: 16,
  selectorStrokeWidth: 2,
  selectorDragScale: 1.15,
  selectorDragDuration: 300,
  selectorMoveDuration: 280,
  springBounce: 0.3,
  ringThickness: 2,
  ringSpacing: 2,
  ringDuration: 320,
  morphDuration: 480,
});

export function DotStyleProvider({ children }: { children: ReactNode }) {
  const values = useDialKit("Theme dots", {
    defaultDotSize: [16, 8, 32, 1],
    dotSpacing: [14, 0, 32, 1],
    selectionBarHeight: [32, 16, 64, 1],
    checkButtonGap: [8, 0, 40, 1],
    plusIconSize: [16, 8, 48, 1],
    plusIconStrokeWidth: [1.7, 0.5, 6, 0.1],
    checkIconSize: [16, 8, 48, 1],
    checkIconStrokeWidth: [1.7, 0.5, 6, 0.1],
    selectorDelay: [400, 0, 1500, 25],
    selectorDotSize: [16, 8, 40, 1],
    selectorStrokeWidth: [2, 0, 6, 0.5],
    selectorDragScale: [1.15, 1, 1.5, 0.01],
    selectorDragDuration: [300, 100, 800, 10],
    selectorMoveDuration: [280, 100, 800, 10],
    springBounce: [0.3, 0, 0.6, 0.05],
    ringThickness: [2, 0, 6, 0.5],
    ringSpacing: [2, 0, 8, 0.5],
    ringDuration: [320, 100, 800, 10],
    morphDuration: [480, 150, 1200, 10],
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
