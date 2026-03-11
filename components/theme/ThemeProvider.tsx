"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getCurrentTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyThemeToDOM(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getCurrentTheme);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        setThemeState(newTheme);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (!storedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
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
    const newTheme = theme === "light" ? "dark" : "light";
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
