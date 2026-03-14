"use client";

import { SITE_CONFIG, SOCIAL_LINKS } from "@/data/config";
import Link from "next/link";
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
    <footer className="mt-12 sm:mt-20 pt-6 border-t border-border/70">
      <div className="flex flex-col sm:flex-row justify-between gap-4 text-[11px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
        <span>{copyright}</span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => handleSocialLinkClick(link)}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
