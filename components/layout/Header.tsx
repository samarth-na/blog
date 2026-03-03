"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NAV_ITEMS, SITE_CONFIG } from "@/data/config";
import posthog from "posthog-js";

interface HeaderProps {
  logo?: string;
  currentPath?: string;
}

export function Header({ logo = SITE_CONFIG.logo, currentPath = "/" }: HeaderProps) {
  // Ref persists across React StrictMode's simulated unmount/remount,
  // preventing the reveal animation from firing twice in development.
  const hasAnimated = useRef(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      setMounted(true);
    }
  }, []);

  const handleNavClick = (item: { label: string; href: string }) => {
    posthog.capture("navigation_clicked", {
      label: item.label,
      href: item.href,
    });
  };

  return (
    <header className={`mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ${mounted ? 'animate-header-reveal' : 'opacity-0'}`}>
      <div>
        <Link
          href="/"
          onClick={() => handleNavClick({ label: "home", href: "/" })}
          className="text-2xl font-medium underline hover:text-teal-600 font-serif"
        >
          {logo}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex gap-2 font-medium underline text-muted-foreground flex-wrap">
          {NAV_ITEMS.map((item, i) => (
            <React.Fragment key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={currentPath === item.href ? "text-foreground" : ""}
              >
                {item.label}
              </Link>
              {i < NAV_ITEMS.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
