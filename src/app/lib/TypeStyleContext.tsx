"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

import { useDialKit } from "dialkit";
import { transitionText } from "./text-transition";

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
  const request = useRef(0);
  const settings = useDialKit("Text transitions", {
    textAnimation: true,
    layoutAnimation: true,
    duration: [430, 0, 1000, 10],
    layoutDuration: [1000, 0, 1000, 10],
    replay: { type: "action" },
  }, { id: "site-text-transitions", persist: true, onAction: () => replay.current() });

  const animateFont = async (style: TypeStyle) => {
    const id = ++request.current;
    // Load the destination face before measuring, avoiding a second reflow
    // when a fallback font is replaced by the downloaded font.
    await document.fonts.ready;
    await document.fonts.load(`16px ${fontMap[style]}`).catch(() => {});
    if (id !== request.current) return;
    cancel.current?.();
    if (!root.current) return;
    cancel.current = transitionText(root.current, () => {
      document.body.style.fontFamily = fontMap[style];
    }, settings.duration, settings.layoutDuration, settings.textAnimation, settings.layoutAnimation);
  };
  const setTypeStyle = (style: TypeStyle) => {
    if (style === typeStyle) return;
    updateTypeStyle(style);
    animateFont(style);
  };
  useEffect(() => { replay.current = () => animateFont(typeStyle); });
  useEffect(() => () => { request.current++; cancel.current?.(); }, []);

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
