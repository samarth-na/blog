"use client";

import { useEffect, useState, useRef } from "react";

export function ThemeTransition() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [newTheme, setNewTheme] = useState<"light" | "dark">("light");
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: "light" | "dark" }>;
      const newThemeValue = customEvent.detail.theme;
      
      setNewTheme(newThemeValue);
      
      if (circleRef.current) {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        setCoords({ x, y });
      }
      
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };

    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  if (!isAnimating) return null;

  const bgColor = newTheme === "dark" 
    ? "oklch(21% 0.006 285.885)" 
    : "oklch(0.9466 0.0121 67.68)";

  return (
    <div
      ref={circleRef}
      className="theme-transition-circle active"
      style={{
        "--x": `${coords.x}px`,
        "--y": `${coords.y}px`,
        "--background": bgColor,
        backgroundColor: bgColor,
      } as React.CSSProperties}
    />
  );
}
