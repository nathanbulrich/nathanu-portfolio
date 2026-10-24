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
import { useDialKit } from "dialkit";
import {
  THEME_PALETTES,
  DEFAULT_THEME_RECIPE,
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
  const recipe = useDialKit("Custom color theme", {
    useCustomTheme: true,
    background: {
      saturation: [75, 0, 100, 1],
      lightness: [97, 0, 100, 0.5],
    },
    text: {
      saturation: [60, 0, 100, 1],
      lightness: [28, 0, 100, 0.5],
    },
    secondaryText: {
      saturation: [40, 0, 100, 1],
      lightness: [38, 0, 100, 0.5],
    },
    borders: {
      saturation: [55, 0, 100, 1],
      lightness: [40, 0, 100, 1],
      opacity: [20, 0, 100, 1],
    },
    selection: {
      saturation: [80, 0, 100, 1],
      lightness: [82, 0, 100, 1],
    },
  }, { id: "custom-color-theme", persist: true });
  const activeRecipe = recipe.useCustomTheme ? recipe : DEFAULT_THEME_RECIPE;
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
    ? paletteFromHue(preview, activeRecipe)
    : customTheme
      ? paletteFromHue(customTheme.hue, activeRecipe)
      : recipe.useCustomTheme && presetName !== "neutral"
        ? paletteFromPreset(presetName, recipe)
        : palettes[activeTheme ?? "neutral"] ?? THEME_PALETTES.neutral;
  const dots = [...DOT_COLORS, ...customThemes.map(({ name, hue }) => ({ name, hex: paletteFromHue(hue).dot }))];

  const addColor = useCallback((hue: number) => {
    const name: ThemeName = `custom-${nextColorId.current++}`;
    setCustomThemes((themes) => [...themes, { name, hue }]);
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
