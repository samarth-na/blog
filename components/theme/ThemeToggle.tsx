"use client";

import posthog from "posthog-js";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    const cycle: Record<string, string> = {
      light: "dark",
      dark: "black",
      black: "light",
    };
    const newTheme = cycle[theme];
    toggleTheme();
    posthog.capture("theme_toggled", {
      from_theme: theme,
      to_theme: newTheme,
    });
  };

  const label = theme.charAt(0).toUpperCase() + theme.slice(1);

  const ariaLabel = {
    light: "Switch to dark mode",
    dark: "Switch to black mode",
    black: "Switch to light mode",
  }[theme];

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="h-8 mx-1 px-2 border border-border/70 text-[11px] tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
      aria-label={ariaLabel}
      suppressHydrationWarning
    >
      {label}
    </button>
  );
}
