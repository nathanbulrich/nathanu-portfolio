"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type TypeStyle = "mono" | "serif" | "sans";

interface TypeStyleContextValue {
  typeStyle: TypeStyle;
  setTypeStyle: (style: TypeStyle) => void;
}

const TypeStyleContext = createContext<TypeStyleContextValue>({
  typeStyle: "mono",
  setTypeStyle: () => {},
});

const fontMap: Record<TypeStyle, string> = {
  mono: "'Berkeley Mono', ui-monospace, monospace",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, -apple-system, sans-serif",
};

export function TypeStyleProvider({ children }: { children: ReactNode }) {
  const [typeStyle, setTypeStyle] = useState<TypeStyle>("mono");

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
    document.body.style.fontFamily = fontMap[typeStyle];
  }, [typeStyle]);

  return (
    <TypeStyleContext.Provider value={{ typeStyle, setTypeStyle }}>
      {children}
    </TypeStyleContext.Provider>
  );
}

export function useTypeStyle() {
  return useContext(TypeStyleContext);
}
