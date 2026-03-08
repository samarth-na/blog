"use client";

import Link from "next/link";
import posthog from "posthog-js";
import React, { useEffect, useRef, useState } from "react";
import { TypeTabs } from "@/components/blog/TypeTabs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SITE_CONFIG, STATIC_NAV_ITEMS } from "@/data/config";

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
      className={`mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ${mounted ? "animate-header-reveal" : "opacity-0"}`}
    >
      <div>
        <Link
          href="/"
          onClick={() => handleNavClick({ label: "home", href: "/" })}
          className="text-2xl font-medium underline hover:text-teal-600 font-serif"
        >
          {logo}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <TypeTabs categories={categories} />
        <nav className="flex gap-2 font-medium underline text-muted-foreground flex-wrap">
          {STATIC_NAV_ITEMS.map((item, i) => (
            <React.Fragment key={item.href}>
              <span>/</span>
              <Link
                href={item.href}
                onClick={() => handleNavClick(item)}
                className={currentPath === item.href ? "text-foreground" : ""}
              >
                {item.label}
              </Link>

              {i < STATIC_NAV_ITEMS.length - 1}
            </React.Fragment>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
