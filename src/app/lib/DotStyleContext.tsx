"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";

const DotStyleContext = createContext({
  ringThickness: 2,
  ringSpacing: 2,
  ringDuration: 320,
  blackDotColor: "#000000",
});

export function DotStyleProvider({ children }: { children: ReactNode }) {
  const values = useDialKit("Theme dots", {
    ringThickness: [2, 0, 6, 0.5],
    ringSpacing: [2, 0, 8, 0.5],
    ringDuration: [320, 100, 800, 10],
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
