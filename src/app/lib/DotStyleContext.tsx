"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";

const DotStyleContext = createContext({
  defaultDotSize: 20,
  dotSpacing: 28,
  selectionBarHeight: 32,
  checkButtonGap: 8,
  plusIconSize: 22,
  plusIconStrokeWidth: 1.6,
  checkIconSize: 20,
  checkIconStrokeWidth: 1.6,
  selectorDelay: 175,
  selectorDotSize: 20,
  selectorStrokeWidth: 3,
  selectorDragScale: 1.5,
  selectorDragDuration: 340,
  selectorMoveDuration: 470,
  addColorSpaceDuration: 400,
  newColorPopDuration: 260,
  springBounce: 0.05,
  ringThickness: 2,
  ringSpacing: 2,
  ringDuration: 220,
  morphDuration: 220,
});

export function DotStyleProvider({ children }: { children: ReactNode }) {
  const values = useDialKit("Theme dots", {
    defaultDotSize: [20, 8, 32, 1],
    dotSpacing: [28, 0, 32, 1],
    selectionBarHeight: [32, 16, 64, 1],
    checkButtonGap: [8, 0, 40, 1],
    plusIconSize: [22, 8, 48, 1],
    plusIconStrokeWidth: [1.6, 0.5, 6, 0.1],
    checkIconSize: [20, 8, 48, 1],
    checkIconStrokeWidth: [1.6, 0.5, 6, 0.1],
    selectorDelay: [175, 0, 1500, 25],
    selectorDotSize: [20, 8, 40, 1],
    selectorStrokeWidth: [3, 0, 6, 0.5],
    selectorDragScale: [1.5, 1, 1.5, 0.01],
    selectorDragDuration: [340, 100, 800, 10],
    selectorMoveDuration: [470, 100, 800, 10],
    addColorSpaceDuration: [400, 100, 800, 10],
    newColorPopDuration: [260, 100, 800, 10],
    springBounce: [0.05, 0, 0.6, 0.05],
    ringThickness: [2, 0, 6, 0.5],
    ringSpacing: [2, 0, 8, 0.5],
    ringDuration: [220, 100, 800, 10],
    morphDuration: [220, 150, 1200, 10],
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
