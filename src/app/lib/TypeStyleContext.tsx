"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

import { useDialKit } from "dialkit";
import { transitionText, type TextTransition } from "./text-transition";

type TypeStyle = "mono" | "serif" | "sans";

interface TypeStyleContextValue {
  typeStyle: TypeStyle;
  setTypeStyle: (style: TypeStyle) => void;
}

const TypeStyleContext = createContext<TypeStyleContextValue>({
  typeStyle: "serif",
  setTypeStyle: () => {},
});

const fontMap: Record<TypeStyle, string> = {
  mono: "'Berkeley Mono', ui-monospace, monospace",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, -apple-system, sans-serif",
};

export function TypeStyleProvider({ children }: { children: ReactNode }) {
  const [typeStyle, updateTypeStyle] = useState<TypeStyle>("serif");
  const root = useRef<HTMLDivElement>(null);
  const cancel = useRef<(() => void) | null>(null);
  const replay = useRef<() => void>(() => {});
  const settings = useDialKit("Text transitions", {
    direction: { type: "select", options: ["Soft focus", "Typesetter shift", "Ink impression", "Directional wipe", "Layout glide"], default: "Soft focus" },
    duration: [300, 0, 1000, 10],
    replay: { type: "action" },
  }, { id: "site-text-transitions", persist: true, onAction: () => replay.current() });

  const animateFont = (style: TypeStyle) => {
    cancel.current?.();
    if (!root.current) return;
    cancel.current = transitionText(root.current, () => {
      document.body.style.fontFamily = fontMap[style];
    }, settings.direction as TextTransition, settings.duration);
  };
  const setTypeStyle = (style: TypeStyle) => {
    if (style === typeStyle) return;
    updateTypeStyle(style);
    animateFont(style);
  };
  useEffect(() => { replay.current = () => animateFont(typeStyle); });
  useEffect(() => () => cancel.current?.(), []);

  useEffect(() => {
    // Load Inter from Google Fonts if not already loaded
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    document.body.style.fontFamily = fontMap.serif;
  }, []);

  return (
    <TypeStyleContext.Provider value={{ typeStyle, setTypeStyle }}>
      <div ref={root} style={{ display: "contents" }}>{children}</div>
    </TypeStyleContext.Provider>
  );
}

export function useTypeStyle() {
  return useContext(TypeStyleContext);
}
