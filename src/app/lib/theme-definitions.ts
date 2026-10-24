export type ThemeColorName =
  | "red"
  | "green"
  | "blue"
  | "cyan"
  | "yellow"
  | "pink";

export type BuiltInThemeName = "neutral" | ThemeColorName;
export type ThemeName = BuiltInThemeName | `custom-${number}`;

export interface ThemePalette {
  dot: string;
  bg: string;
  border: string;
  text: string;
  textSecondary: string;
  selection: string;
}

export const SPECTRUM_HUES = {
  red: 0,
  yellow: 60,
  green: 120,
  cyan: 180,
  blue: 240,
  pink: 300,
} as const;

export const SPECTRUM_GRADIENT = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360]
  .map((hue) => paletteFromHue(hue).dot).join(", ")})`;

export const DOT_COLORS: { name: ThemeName; hex: string }[] = [
  { name: "neutral", hex: "#000000" },
  ...Object.entries(SPECTRUM_HUES).map(([name, hue]) => ({
    name: name as ThemeColorName,
    hex: paletteFromHue(hue).dot,
  })),
];

export const THEME_PALETTES: Record<BuiltInThemeName, ThemePalette> = {
  neutral: {
    dot: "#000000",
    bg: "#fbfbfb",
    border: "rgba(37, 42, 73, 0.13)",
    text: "rgba(37, 42, 73, 0.9)",
    textSecondary: "rgba(37, 42, 73, 0.55)",
    selection: "#fde68a",
  },
  red: {
    dot: paletteFromHue(0).dot,
    bg: "#fef2f2",
    border: "rgba(249, 69, 77, 0.18)",
    text: "#d32f2f",
    textSecondary: "rgba(211, 47, 47, 0.7)",
    selection: "#fca5a5",
  },
  green: {
    dot: paletteFromHue(120).dot,
    bg: "#f0fdf4",
    border: "rgba(14, 215, 110, 0.18)",
    text: "#0a8f4a",
    textSecondary: "rgba(10, 143, 74, 0.7)",
    selection: "#86efac",
  },
  blue: {
    dot: paletteFromHue(240).dot,
    bg: "#f0f0ff",
    border: "rgba(76, 78, 199, 0.18)",
    text: "#3a3bb0",
    textSecondary: "rgba(58, 59, 176, 0.7)",
    selection: "#a5b4fc",
  },
  cyan: {
    dot: paletteFromHue(180).dot,
    bg: "#f0faff",
    border: "rgba(113, 215, 255, 0.22)",
    text: "#0c7fb5",
    textSecondary: "rgba(12, 127, 181, 0.7)",
    selection: "#a5f3fc",
  },
  yellow: {
    dot: paletteFromHue(60).dot,
    bg: "#fffde6",
    border: "rgba(200, 180, 0, 0.18)",
    text: "#8a7d00",
    textSecondary: "rgba(138, 125, 0, 0.7)",
    selection: "#fde68a",
  },
  pink: {
    dot: paletteFromHue(300).dot,
    bg: "#fff0f8",
    border: "rgba(255, 82, 185, 0.18)",
    text: "#c4148a",
    textSecondary: "rgba(196, 20, 138, 0.7)",
    selection: "#f9a8d4",
  },
};

export const CSS_VAR_MAP = {
  bg: "--theme-bg",
  border: "--theme-border",
  text: "--theme-text",
  textSecondary: "--theme-text-secondary",
  selection: "--theme-selection",
} as const;

// Keep custom themes as light surfaces with dark, readable text at every hue.
export function paletteFromHue(hue: number): ThemePalette {
  return {
    dot: `hsl(${hue} 82% 56%)`,
    bg: `hsl(${hue} 75% 97%)`,
    border: `hsl(${hue} 55% 40% / 0.2)`,
    text: `hsl(${hue} 60% 28%)`,
    textSecondary: `hsl(${hue} 40% 38%)`,
    selection: `hsl(${hue} 80% 82%)`,
  };
}
