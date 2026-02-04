"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  THEME_PALETTES,
  CSS_VAR_MAP,
  type ThemeName,
  type ThemePalette,
} from "./theme-definitions";

interface ThemeContextValue {
  activeTheme: ThemeName;
  setTheme: (name: ThemeName) => void;
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("neutral");
  const palette = THEME_PALETTES[activeTheme];

  const setTheme = useCallback((name: ThemeName) => {
    setActiveTheme((prev) => (prev === name ? "neutral" : name));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const p = THEME_PALETTES[activeTheme];
    root.style.setProperty(CSS_VAR_MAP.bg, p.bg);
    root.style.setProperty(CSS_VAR_MAP.border, p.border);
    root.style.setProperty(CSS_VAR_MAP.text, p.text);
    root.style.setProperty(CSS_VAR_MAP.textSecondary, p.textSecondary);
    root.dataset.theme = activeTheme;
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, palette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
