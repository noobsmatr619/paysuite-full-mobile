/**
 * PaySuite theme tokens (Expo).
 * Keeps template exports (Fonts/Spacing/ThemeColor) for leftover starter components.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#0f172a",
    background: "#f8fafc",
    backgroundElement: "#e2e8f0",
    backgroundSelected: "#dbeafe",
    textSecondary: "#64748b",
    card: "#ffffff",
    border: "#e2e8f0",
    primary: "#0f766e",
    primarySoft: "#ccfbf1",
    danger: "#e11d48",
    success: "#059669",
    warning: "#d97706",
    tabIconDefault: "#94a3b8",
    tabIconSelected: "#0f766e",
  },
  dark: {
    text: "#f8fafc",
    background: "#0b1220",
    backgroundElement: "#1f2937",
    backgroundSelected: "#134e4a",
    textSecondary: "#94a3b8",
    card: "#111827",
    border: "#1f2937",
    primary: "#2dd4bf",
    primarySoft: "#134e4a",
    danger: "#fb7185",
    success: "#34d399",
    warning: "#fbbf24",
    tabIconDefault: "#64748b",
    tabIconSelected: "#2dd4bf",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export function money(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n || 0);
}
