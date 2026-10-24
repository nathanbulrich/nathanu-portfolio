"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  THEME_PALETTES,
  DOT_COLORS,
  paletteFromHue,
  CSS_VAR_MAP,
  type ThemeName,
  type ThemePalette,
} from "./theme-definitions";

interface CustomTheme {
  name: ThemeName;
  hex: string;
  palette: ThemePalette;
}

interface ThemeContextValue {
  dots: { name: ThemeName; hex: string }[];
  previewHue: (hue: number | null) => void;
  addColor: (hue: number) => void;
  activeTheme: ThemeName;
  setTheme: (name: ThemeName) => void;
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("neutral");
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [preview, setPreview] = useState<number | null>(null);
  const nextColorId = useRef(0);
  const palettes: Partial<Record<ThemeName, ThemePalette>> = THEME_PALETTES;
  const palette = preview !== null
    ? paletteFromHue(preview)
    : customThemes.find(({ name }) => name === activeTheme)?.palette
      ?? palettes[activeTheme] ?? THEME_PALETTES.neutral;
  const dots = [...DOT_COLORS, ...customThemes];

  const addColor = useCallback((hue: number) => {
    const name: ThemeName = `custom-${nextColorId.current++}`;
    const customPalette = paletteFromHue(hue);
    setCustomThemes((themes) => [...themes, { name, hex: customPalette.dot, palette: customPalette }]);
    setActiveTheme(name);
    setPreview(null);
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    setPreview(null);
    setActiveTheme((prev) => (prev === name ? "neutral" : name));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const p = palette;
    root.style.setProperty(CSS_VAR_MAP.bg, p.bg);
    root.style.setProperty(CSS_VAR_MAP.border, p.border);
    root.style.setProperty(CSS_VAR_MAP.text, p.text);
    root.style.setProperty(CSS_VAR_MAP.textSecondary, p.textSecondary);
    root.style.setProperty(CSS_VAR_MAP.selection, p.selection);
    root.dataset.theme = activeTheme;
  }, [activeTheme, palette]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, palette, dots, previewHue: setPreview, addColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
