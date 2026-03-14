"use client";

import { TypeTabs } from "@/components/blog/TypeTabs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SITE_CONFIG, STATIC_NAV_ITEMS } from "@/data/config";
import Link from "next/link";
import posthog from "posthog-js";
import React, { useEffect, useRef, useState } from "react";

interface HeaderProps {
  logo?: string;
  currentPath?: string;
  categories?: string[];
}

export function Header({
  logo = SITE_CONFIG.logo,
  currentPath = "/",
  categories = [],
}: HeaderProps) {
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
    <header
      className={`sticky top-0 z-50 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-2 bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 ${mounted ? "animate-header-reveal" : "opacity-0"}`}
    >
      <div className="flex w-full items-center justify-between sm:w-auto">
        <Link
          href="/"
          onClick={() => handleNavClick({ label: "home", href: "/" })}
          className="text-3xl sm:text-4xl md:text-5xl leading-[0.92] tracking-[-0.014em] font-medium font-serif hover:text-teal-700 transition-colors"
        >
          {logo}
        </Link>
        <div className="sm:hidden">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <TypeTabs categories={categories} />
        <nav className="flex gap-2 text-[11px] tracking-[0.2em] uppercase font-mono text-muted-foreground flex-wrap">
          {STATIC_NAV_ITEMS.map((item, i) => (
            <React.Fragment key={item.href}>
              <span>/</span>
              <Link
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={`${currentPath === item.href ? "text-foreground" : ""} hover:text-foreground transition-colors`}
              >
                {item.label}
              </Link>

              {i < STATIC_NAV_ITEMS.length - 1}
            </React.Fragment>
          ))}
        </nav>
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
