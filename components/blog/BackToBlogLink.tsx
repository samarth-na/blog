"use client";

import Link from "next/link";
import posthog from "posthog-js";

interface BackToBlogLinkProps {
  slug?: string;
  category?: string;
}

export function BackToBlogLink({ slug, category }: BackToBlogLinkProps) {
  const handleClick = () => {
    posthog.capture("back_to_blog_clicked", {
      from_slug: slug,
      category,
    });
  };

  const backPath = category ? `/${category}` : "/thoughts";
  const backLabel = category ? `← back to ${category}` : "← back to thoughts";

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
