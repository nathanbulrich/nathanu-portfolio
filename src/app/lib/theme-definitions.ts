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

export interface ThemeRecipe {
  background: { saturation: number; lightness: number };
  text: { saturation: number; lightness: number };
  secondaryText: { saturation: number; lightness: number };
  borders: { saturation: number; lightness: number; opacity: number };
  selection: { saturation: number; lightness: number };
}

export const DEFAULT_THEME_RECIPE: ThemeRecipe = {
  background: { saturation: 75, lightness: 97 },
  text: { saturation: 60, lightness: 28 },
  secondaryText: { saturation: 40, lightness: 38 },
  borders: { saturation: 55, lightness: 40, opacity: 20 },
  selection: { saturation: 80, lightness: 82 },
};

export const SPECTRUM_GRADIENT = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360]
  .map((hue) => paletteFromHue(hue).dot).join(", ")})`;

export const DOT_COLORS: { name: ThemeName; hex: string }[] = [
  { name: "neutral", hex: "#000000" },
  { name: "red", hex: "#f9454d" },
  { name: "green", hex: "#0ed76e" },
  { name: "blue", hex: "#4c4ec7" },
  { name: "cyan", hex: "#71d7ff" },
  { name: "yellow", hex: "#fff204" },
  { name: "pink", hex: "#ff52b9" },
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
    dot: "#f9454d",
    bg: "#fef2f2",
    border: "rgba(249, 69, 77, 0.18)",
    text: "#d32f2f",
    textSecondary: "rgba(211, 47, 47, 0.7)",
    selection: "#fca5a5",
  },
  green: {
    dot: "#0ed76e",
    bg: "#f0fdf4",
    border: "rgba(14, 215, 110, 0.18)",
    text: "#0a8f4a",
    textSecondary: "rgba(10, 143, 74, 0.7)",
    selection: "#86efac",
  },
  blue: {
    dot: "#4c4ec7",
    bg: "#f0f0ff",
    border: "rgba(76, 78, 199, 0.18)",
    text: "#3a3bb0",
    textSecondary: "rgba(58, 59, 176, 0.7)",
    selection: "#a5b4fc",
  },
  cyan: {
    dot: "#71d7ff",
    bg: "#f0faff",
    border: "rgba(113, 215, 255, 0.22)",
    text: "#0c7fb5",
    textSecondary: "rgba(12, 127, 181, 0.7)",
    selection: "#a5f3fc",
  },
  yellow: {
    dot: "#fff204",
    bg: "#fffde6",
    border: "rgba(200, 180, 0, 0.18)",
    text: "#8a7d00",
    textSecondary: "rgba(138, 125, 0, 0.7)",
    selection: "#fde68a",
  },
  pink: {
    dot: "#ff52b9",
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

function luminance(hue: number, saturation: number, lightness: number): number {
  const h = ((hue % 360) + 360) % 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const a = s * Math.min(l, 1 - l);
  const channels = [0, 8, 4].map((n) => {
    const k = (n + h / 30) % 12;
    const channel = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function readableText(hue: number, saturation: number, lightness: number, backgroundLuminance: number): string {
  // Let color and tone vary while preserving readable body-text contrast.
  let adjustedLightness = lightness;
  while (adjustedLightness > 0 &&
    (backgroundLuminance + 0.05) / (luminance(hue, saturation, adjustedLightness) + 0.05) < 4.5) {
    adjustedLightness = Math.max(0, adjustedLightness - 0.5);
  }
  return `hsl(${hue} ${saturation}% ${adjustedLightness}%)`;
}

export function paletteFromHue(hue: number, recipe: ThemeRecipe = DEFAULT_THEME_RECIPE): ThemePalette {
  const { background, text, secondaryText, borders, selection } = recipe;
  const backgroundLuminance = luminance(hue, background.saturation, background.lightness);
  return {
    // Keep the picked swatch and spectrum independent of page styling.
    dot: `hsl(${hue} 82% 56%)`,
    bg: `hsl(${hue} ${background.saturation}% ${background.lightness}%)`,
    border: `hsl(${hue} ${borders.saturation}% ${borders.lightness}% / ${borders.opacity / 100})`,
    text: readableText(hue, text.saturation, text.lightness, backgroundLuminance),
    textSecondary: readableText(hue, secondaryText.saturation, secondaryText.lightness, backgroundLuminance),
    selection: `hsl(${hue} ${selection.saturation}% ${selection.lightness}%)`,
  };
}

export function paletteFromPreset(name: ThemeColorName, recipe: ThemeRecipe): ThemePalette {
  const { dot } = THEME_PALETTES[name];
  const [r, g, b] = [1, 3, 5].map((offset) => parseInt(dot.slice(offset, offset + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  const hue = chroma === 0 ? 0 : ((60 * (
    max === r ? (g - b) / chroma : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4
  )) + 360) % 360;
  return { ...paletteFromHue(hue, recipe), dot };
}
