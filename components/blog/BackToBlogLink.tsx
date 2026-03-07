"use client";

import Link from "next/link";
import posthog from "posthog-js";

interface BackToBlogLinkProps {
  slug?: string;
  type?: string;
}

export function BackToBlogLink({ slug, type }: BackToBlogLinkProps) {
  const handleClick = () => {
    posthog.capture("back_to_blog_clicked", {
      from_slug: slug,
      type,
    });
  };

  const backPath = type ? `/${type}` : "/thoughts";
  const backLabel = type ? `back to ${type}` : "← back to thoughts";

  return (
    <Link
      href={backPath}
      onClick={handleClick}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {backLabel}
    </Link>
  );
}
