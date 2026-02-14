import Link from "next/link";

interface SidebarLayoutProps {
  mainContent: React.ReactNode;
  sidebarTitle?: string;
  sidebarLinks?: { label: string; href: string }[];
  sidebarWidth?: string;
}

export function BlogSidebarLayout({
  mainContent,
  sidebarTitle = "sidebar",
  sidebarLinks = [],
  sidebarWidth = "180px",
}: SidebarLayoutProps) {
  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-8 border-t border-b border-border py-6">
      <div>
        {mainContent}
      </div>
      <div style={{ width: sidebarWidth }}>
        <h3 className="text-xs text-muted-foreground mb-3">{sidebarTitle}</h3>
        <ul className="space-y-2 text-xs">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
