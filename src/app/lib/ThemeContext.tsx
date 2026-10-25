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
import { THEME_RECIPE } from "./theme-settings";
import {
  THEME_PALETTES,
  DOT_COLORS,
  paletteFromHue,
  paletteFromPreset,
  CSS_VAR_MAP,
  type BuiltInThemeName,
  type ThemeName,
  type ThemePalette,
} from "./theme-definitions";

interface CustomTheme {
  name: ThemeName;
  hue: number;
}

interface ThemeContextValue {
  dots: { name: ThemeName; hex: string }[];
  previewHue: (hue: number | null) => void;
  addColor: (hue: number) => void;
  activeTheme: ThemeName | null;
  setTheme: (name: ThemeName) => void;
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeName | null>(null);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [preview, setPreview] = useState<number | null>(null);
  const nextColorId = useRef(0);
  const palettes: Partial<Record<ThemeName, ThemePalette>> = THEME_PALETTES;
  const customTheme = customThemes.find(({ name }) => name === activeTheme);
  const presetName: BuiltInThemeName = activeTheme !== null && activeTheme in THEME_PALETTES
    ? activeTheme as BuiltInThemeName
    : "neutral";
  const palette = preview !== null
    ? paletteFromHue(preview, THEME_RECIPE)
    : customTheme
      ? paletteFromHue(customTheme.hue, THEME_RECIPE)
      : presetName !== "neutral"
        ? paletteFromPreset(presetName, THEME_RECIPE)
        : palettes[activeTheme ?? "neutral"] ?? THEME_PALETTES.neutral;
  const dots = [...DOT_COLORS, ...customThemes.map(({ name, hue }) => ({ name, hex: paletteFromHue(hue).dot }))]
    .slice(-DOT_COLORS.length);

  const addColor = useCallback((hue: number) => {
    const name: ThemeName = `custom-${nextColorId.current++}`;
    setCustomThemes((themes) => [...themes, { name, hue }].slice(-DOT_COLORS.length));
    setActiveTheme(name);
    setPreview(null);
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    setPreview(null);
    setActiveTheme((prev) => (prev === name ? null : name));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const p = palette;
    root.style.setProperty(CSS_VAR_MAP.bg, p.bg);
    root.style.setProperty(CSS_VAR_MAP.border, p.border);
    root.style.setProperty(CSS_VAR_MAP.text, p.text);
    root.style.setProperty(CSS_VAR_MAP.textSecondary, p.textSecondary);
    root.style.setProperty(CSS_VAR_MAP.selection, p.selection);
    root.dataset.theme = activeTheme ?? "neutral";
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
