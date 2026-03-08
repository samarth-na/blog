"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import React from "react";
import { typeToLabel } from "@/lib/typeConfig";

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
    <nav className="flex gap-2 font-medium underline text-muted-foreground flex-wrap">
      {categories.map((category, index) => (
        <React.Fragment key={category}>
          <Link
            href={`/${category}`}
            onClick={() => handleCategoryClick(category)}
            className={pathname === `/${category}` ? "text-foreground" : ""}
          >
            {typeToLabel(category)}
          </Link>
          {index < categories.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
