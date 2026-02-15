import Link from "next/link";
import React from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface HeaderProps {
  logo?: string;
  currentPath?: string;
}

const NAV_ITEMS = [
  { label: "blog", href: "/blog" },
  { label: "bookmarks", href: "/bookmarks" },
  { label: "interests", href: "/interests" },
  { label: "now", href: "/now" },
];

export function Header({ logo = "Samarth", currentPath = "/" }: HeaderProps) {
  return (
    <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <Link
          href="/"
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
