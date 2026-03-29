"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "black";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getCurrentTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const hasBlack = document.documentElement.classList.contains("black");
  const hasDark = document.documentElement.classList.contains("dark");
  if (hasBlack) return "black";
  if (hasDark) return "dark";
  return "light";
}

function applyThemeToDOM(theme: Theme) {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark" || theme === "black");
  el.classList.toggle("black", theme === "black");
  localStorage.setItem("theme", theme);
}

function isValidTheme(value: string): value is Theme {
  return value === "light" || value === "dark" || value === "black";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getCurrentTheme);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue && isValidTheme(e.newValue)) {
        applyThemeToDOM(e.newValue);
        setThemeState(e.newValue);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");
      if (!stored || !isValidTheme(stored)) {
        const newTheme = e.matches ? "dark" : "light";
        applyThemeToDOM(newTheme);
        setThemeState(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: theme is intentionally excluded
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    if (theme !== currentTheme) {
      setThemeState(currentTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    applyThemeToDOM(newTheme);
    setThemeState(newTheme);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: newTheme } }));
  }, []);

  const toggleTheme = useCallback(() => {
    const cycle: Record<Theme, Theme> = {
      light: "dark",
      dark: "black",
      black: "light",
    };
    const newTheme = cycle[theme];
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
