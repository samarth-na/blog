/**
 * Site-wide configuration defaults
 * Centralizes all hardcoded values for easy customization
 */

export const SITE_CONFIG = {
  name: "Samarth Nagar",
  logo: "Samarth",
  copyright: "© 2026",
} as const;

export const NAV_ITEMS = [
  { label: "blog", href: "/blog" },
  { label: "bookmarks", href: "/bookmarks" },
  { label: "interests", href: "/interests" },
  { label: "now", href: "/now" },
] as const;

export const SOCIAL_LINKS = [
  { label: "rss", href: "#" },
  { label: "twitter", href: "#" },
  { label: "github", href: "#" },
] as const;

export const DEFAULT_SOCIALS = [
  { label: "twitter", href: "#twitter" },
  { label: "github", href: "#github" },
  { label: "linkedin", href: "#linkedin" },
  { label: "email", href: "#email" },
  { label: "rss", href: "#rss" },
] as const;

export const LAYOUT_CONFIG = {
  maxWidth: {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-3xl",
    "2xl": "max-w-3xl",
  },
} as const;
