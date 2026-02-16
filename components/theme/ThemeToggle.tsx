"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import posthog from "posthog-js";

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
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
