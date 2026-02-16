"use client";

import Link from "next/link";
import posthog from "posthog-js";

interface BackToBlogLinkProps {
  slug?: string;
}

export function BackToBlogLink({ slug }: BackToBlogLinkProps) {
  const handleClick = () => {
    posthog.capture("back_to_blog_clicked", {
      from_slug: slug,
    });
  };

  return (
    <Link
      href="/blog"
      onClick={handleClick}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      ← back to blogs
    </Link>
  );
}
