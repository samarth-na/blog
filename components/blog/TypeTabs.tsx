"use client";

import { typeToLabel, typeToUrl } from "@/lib/typeConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import React from "react";

interface TypeTabsProps {
  categories?: string[];
}

export function TypeTabs({ categories = [] }: TypeTabsProps) {
  const pathname = usePathname();

  const handleCategoryClick = (category: string) => {
    posthog.capture("category_tab_clicked", {
      category,
      from_path: pathname,
    });
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <nav className="flex gap-2 text-[11px] tracking-[0.2em] uppercase font-mono text-muted-foreground flex-wrap">
      {categories.map((category, index) => (
        <React.Fragment key={category}>
          <Link
            href={typeToUrl(category)}
            onClick={() => handleCategoryClick(category)}
            className={`${pathname === typeToUrl(category) ? "text-foreground" : ""} hover:text-foreground transition-colors`}
          >
            {typeToLabel(category)}
          </Link>
          {index < categories.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
