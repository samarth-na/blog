"use client";

import Link from "next/link";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/data/config";
import posthog from "posthog-js";

interface FooterProps {
  copyright?: string;
  links?: { label: string; href: string }[];
}

export function Footer({
  copyright = SITE_CONFIG.copyright,
  links = [...SOCIAL_LINKS],
}: FooterProps) {
  const handleSocialLinkClick = (link: { label: string; href: string }) => {
    posthog.capture("social_link_clicked", {
      label: link.label,
      href: link.href,
    });
  };

  return (
    <footer className="mt-16 pt-6 border-t border-border">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{copyright}</span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => handleSocialLinkClick(link)}
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
