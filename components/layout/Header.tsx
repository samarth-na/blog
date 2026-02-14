import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface HeaderProps {
  logo?: string;
  currentPath?: string;
}

const NAV_ITEMS = [
  { label: "test", href: "/test" },
  { label: "ui", href: "/ui" },
  { label: "blog", href: "/blog" },
];

export function Header({ logo = "samarth", currentPath = "/" }: HeaderProps) {
  return (
    <header className="mb-12 flex justify-between items-end">
      <div>
        <Link
          href="/"
          className="text-2xl font-medium underline hover:text-teal-600"
          style={{ fontFamily: "'IBM Plex Serif', serif" }}
        >
          {logo}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex gap-2 font-medium underline text-muted-foreground">
          {NAV_ITEMS.map((item, i) => (
            <>
              <Link
                key={item.href}
                href={item.href}
                className={currentPath === item.href ? "text-foreground" : ""}
              >
                {item.label}
              </Link>
              {i < NAV_ITEMS.length - 1 && <span key={`sep-${i}`}>/</span>}
            </>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
