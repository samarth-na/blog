import Link from "next/link";
import { DEFAULT_SOCIALS } from "@/data/config";

interface SocialLinksProps {
  links?: { label: string; href: string }[];
}

export function BlogSocialLinks({ links = [...DEFAULT_SOCIALS] }: SocialLinksProps) {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="hover:text-primary">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
