import Link from "next/link";

interface SocialLinksProps {
  links?: { label: string; href: string }[];
}

const DEFAULT_SOCIALS = [
  { label: "twitter", href: "#twitter" },
  { label: "github", href: "#github" },
  { label: "linkedin", href: "#linkedin" },
  { label: "email", href: "#email" },
  { label: "rss", href: "#rss" },
];

export function BlogSocialLinks({ links = DEFAULT_SOCIALS }: SocialLinksProps) {
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
