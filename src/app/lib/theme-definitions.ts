export type ThemeColorName =
  | "red"
  | "green"
  | "blue"
  | "cyan"
  | "yellow"
  | "pink";

export type ThemeName = "neutral" | ThemeColorName;

export interface ThemePalette {
  dot: string;
  bg: string;
  border: string;
  text: string;
  textSecondary: string;
}

export const DOT_COLORS: { name: ThemeColorName; hex: string }[] = [
  { name: "red", hex: "#f9454d" },
  { name: "green", hex: "#0ed76e" },
  { name: "blue", hex: "#4c4ec7" },
  { name: "cyan", hex: "#71d7ff" },
  { name: "yellow", hex: "#fff204" },
  { name: "pink", hex: "#ff52b9" },
];

export const THEME_PALETTES: Record<ThemeName, ThemePalette> = {
  neutral: {
    dot: "transparent",
    bg: "#fbfbfb",
    border: "rgba(37, 42, 73, 0.13)",
    text: "rgba(37, 42, 73, 0.9)",
    textSecondary: "rgba(37, 42, 73, 0.55)",
  },
  red: {
    dot: "#f9454d",
    bg: "#fef2f2",
    border: "rgba(249, 69, 77, 0.18)",
    text: "#d32f2f",
    textSecondary: "rgba(211, 47, 47, 0.7)",
  },
  green: {
    dot: "#0ed76e",
    bg: "#f0fdf4",
    border: "rgba(14, 215, 110, 0.18)",
    text: "#0a8f4a",
    textSecondary: "rgba(10, 143, 74, 0.7)",
  },
  blue: {
    dot: "#4c4ec7",
    bg: "#f0f0ff",
    border: "rgba(76, 78, 199, 0.18)",
    text: "#3a3bb0",
    textSecondary: "rgba(58, 59, 176, 0.7)",
  },
  cyan: {
    dot: "#71d7ff",
    bg: "#f0faff",
    border: "rgba(113, 215, 255, 0.22)",
    text: "#0c7fb5",
    textSecondary: "rgba(12, 127, 181, 0.7)",
  },
  yellow: {
    dot: "#fff204",
    bg: "#fffde6",
    border: "rgba(200, 180, 0, 0.18)",
    text: "#8a7d00",
    textSecondary: "rgba(138, 125, 0, 0.7)",
  },
  pink: {
    dot: "#ff52b9",
    bg: "#fff0f8",
    border: "rgba(255, 82, 185, 0.18)",
    text: "#c4148a",
    textSecondary: "rgba(196, 20, 138, 0.7)",
  },
};

export const CSS_VAR_MAP = {
  bg: "--theme-bg",
  border: "--theme-border",
  text: "--theme-text",
  textSecondary: "--theme-text-secondary",
} as const;
