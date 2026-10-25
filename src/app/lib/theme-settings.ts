import type { ThemeRecipe } from "./theme-definitions";

// Values captured from the approved color-picker tuning session.
export const DOT_STYLE = {
  defaultDotSize: 20,
  dotSpacing: 28,
  selectionBarHeight: 32,
  checkButtonGap: 8,
  plusIconSize: 22,
  plusIconStrokeWidth: 1.6,
  checkIconSize: 20,
  checkIconStrokeWidth: 1.6,
  selectorDelay: 175,
  selectorDotSize: 20,
  selectorStrokeWidth: 3,
  selectorDragScale: 1.5,
  selectorDragDuration: 340,
  selectorMoveDuration: 470,
  addColorSpaceDuration: 400,
  newColorPopDuration: 260,
  springBounce: 0.05,
  ringThickness: 2,
  ringSpacing: 2,
  ringDuration: 220,
  morphDuration: 220,
} as const;

export const THEME_RECIPE: ThemeRecipe = {
  background: { saturation: 100, lightness: 96.5 },
  text: { saturation: 79, lightness: 50.5 },
  secondaryText: { saturation: 100, lightness: 54.5 },
  borders: { saturation: 55, lightness: 47, opacity: 20 },
  selection: { saturation: 80, lightness: 82 },
};
