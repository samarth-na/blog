"use client";

import Link from "next/link";
import type { ContentItem } from "@/lib/content";

type ContentListProps = {
  items: ContentItem[];
  basePath: string;
  showDate?: boolean;
};

export function ContentList({ items, basePath, showDate = true }: ContentListProps) {
  return (
    <div className="space-y-2 border-t border-border pt-8">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No items found.
        </p>
      ) : (
        items.map((item) => (
          <article key={item.slug} className="group">
            <Link href={`${basePath}/${item.slug}`} className="block">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-medium group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                {showDate && item.date && (
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                  </span>
                )}
              </div>
            </Link>
          </article>
        ))
      )}
    </div>
  );
}
