/**
 * Site-wide configuration defaults
 * Centralizes all hardcoded values for easy customization
 */

export const SITE_CONFIG = {
  name: "Samarth",
  logo: "Samarth",
  copyright: "© 2026",
} as const;

export const STATIC_NAV_ITEMS = [{ label: "now", href: "/now" }] as const;

export const SOCIAL_LINKS = [
  { label: "twitter", href: "https://x.com/samarth7na" },
  { label: "github", href: "https://github.com/samarth-nagar" },
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
