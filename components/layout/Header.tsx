import Link from "next/link";

interface HeaderProps {
  logo?: string;
  currentPath?: string;
}

const NAV_ITEMS = [
  { label: "test", href: "/test" },
  { label: "ui", href: "/ui" },
  { label: "mdx", href: "/mdx" },
];

export function BlogHeader({ logo = "alex", currentPath = "/" }: HeaderProps) {
  return (
    <header className="mb-12 flex justify-between items-end">
      <div>
        <Link href="/" className="text-sm font-medium">
          {logo}
        </Link>
      </div>
      <nav className="flex gap-2 text-xs text-muted-foreground">
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
    </header>
  );
}
