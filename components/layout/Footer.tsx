import Link from "next/link";

interface FooterProps {
  copyright?: string;
  links?: { label: string; href: string }[];
}

const DEFAULT_LINKS = [
  { label: "rss", href: "#" },
  { label: "twitter", href: "#" },
  { label: "github", href: "#" },
];

export function Footer({
  copyright = "© 2026",
  links = DEFAULT_LINKS,
}: FooterProps) {
  return (
    <footer className="mt-16 pt-6 border-t border-border">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{copyright}</span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
