"use client";

import { List as ListIcon, Search, Tag } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useMemo, useState } from "react";
import type { ListItem } from "./types";

type ListProps = {
  items: ListItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  defaultView?: "full" | "minimal";
};

export function List({
  items,
  type,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found matching your criteria.",
  defaultView = "full",
}: ListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(true);
  const [viewMode, setViewMode] = useState<"full" | "minimal">(defaultView);

  const allTags = useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.tags))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, items]);

  useEffect(() => {
    if (!searchQuery) return;

    const timeout = setTimeout(() => {
      posthog.capture("list_search_used", {
        type,
        query: searchQuery,
        results: filteredItems.length,
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchQuery, filteredItems.length, type]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const updated = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];

      posthog.capture("list_tag_toggled", {
        type,
        tag,
        selected: !prev.includes(tag),
        active_tags: updated,
      });

      return updated;
    });
  };

  const handleItemClick = (item: ListItem) => {
    posthog.capture("list_item_clicked", {
      type,
      slug: item.slug,
      title: item.title,
    });
  };

  const toggleViewMode = () => {
    const newMode = viewMode === "full" ? "minimal" : "full";
    setViewMode(newMode);

    posthog.capture("list_view_mode_changed", {
      type,
      mode: newMode,
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[3px] px-4 py-3 bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowTags(!showTags)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>{showTags ? "Hide tags" : "Show tags"}</span>
          </button>

          <button
            type="button"
            onClick={toggleViewMode}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ListIcon className="w-4 h-4" />
            <span>{viewMode === "full" ? "Minimal view" : "Full view"}</span>
          </button>
        </div>

        {showTags && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm border rounded-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={viewMode === "full" ? "space-y-4" : "space-y-2"}>
        {filteredItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
        ) : viewMode === "full" ? (
          filteredItems.map((item) => (
            <article key={item.slug} className="group">
              <Link
                href={`/${type}/${item.slug}`}
                onClick={() => handleItemClick(item)}
                className="editorial-card block border border-border rounded-[3px] p-5 space-y-3"
              >
                {(item.date || item.readTime) && (
                  <div className="text-xs text-muted-foreground">
                    {[item.date, item.readTime].filter(Boolean).join(" · ")}
                  </div>
                )}

                <h2 className="text-lg leading-tight font-medium font-serif group-hover:text-primary transition-colors">
                  {item.title}
                </h2>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span
                        key={`${item.slug}-${tag}`}
                        className="px-2 py-1 text-[11px] tracking-wide rounded-[2px] border border-border text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="h-[1rem] overflow-hidden text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt ?? ""}
                </p>
              </Link>
            </article>
          ))
        ) : (
          filteredItems.map((item) => (
            <article key={item.slug} className="group">
              <Link
                href={`/${type}/${item.slug}`}
                onClick={() => handleItemClick(item)}
                className="block border-b border-border py-3"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <span className="text-xs text-muted-foreground text-right">
                    {[item.date, item.readTime].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
