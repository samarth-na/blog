"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import React from "react";
import { typeToLabel } from "@/lib/typeConfig";

interface TypeTabsProps {
  types?: string[];
}

export function TypeTabs({ types = [] }: TypeTabsProps) {
  const pathname = usePathname();

  const handleTypeClick = (type: string) => {
    posthog.capture("type_tab_clicked", {
      type,
      from_path: pathname,
    });
  };

  if (types.length === 0) {
    return null;
  }

  return (
    <nav className="flex gap-2 font-medium underline text-muted-foreground flex-wrap">
      {types.map((type, index) => (
        <React.Fragment key={type}>
          <Link
            href={`/${type}`}
            onClick={() => handleTypeClick(type)}
            className={pathname === `/${type}` ? "text-foreground" : ""}
          >
            {typeToLabel(type)}
          </Link>
          {index < types.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
