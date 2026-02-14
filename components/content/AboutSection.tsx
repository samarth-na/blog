import Link from "next/link";

interface AboutSectionProps {
  title?: string;
  bio: string;
  links?: { label: string; href: string }[];
}

export function BlogAboutSection({ 
  title = "about", 
  bio, 
  links = [
    { label: "twitter", href: "#" },
    { label: "github", href: "#" },
    { label: "email", href: "#" },
  ] 
}: AboutSectionProps) {
  return (
    <div className="pt-4 border-t border-border">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{bio}</p>
      <div className="flex gap-3 text-xs">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
