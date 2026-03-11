"use client";

import posthog from "posthog-js";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    toggleTheme();
    posthog.capture("theme_toggled", {
      from_theme: theme,
      to_theme: newTheme,
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="h-9 px-3 border border-border/70 text-[11px] tracking-[0.2em] uppercase font-mono text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      suppressHydrationWarning
    >
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}
