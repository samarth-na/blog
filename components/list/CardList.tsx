"use client";

import { Search, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useMemo, useState } from "react";
import type { CardItem } from "./types";

type CardListProps = {
  items: CardItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showImage?: boolean;
  showCardTags?: boolean;
  showCardDate?: boolean;
  showCardReadTime?: boolean;
  metaInlineWithTitle?: boolean;
};

export function CardList({
  items,
  type,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found matching your criteria.",
  showImage = false,
  showCardTags = true,
  showCardDate = true,
  showCardReadTime = true,
  metaInlineWithTitle = false,
}: CardListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(true);

  const allTags = useMemo(() => {
    return Array.from(new Set(items.flatMap((item) => item.tags))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => item.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, items]);

  useEffect(() => {
    if (!searchQuery) return;

    const timeout = setTimeout(() => {
      posthog.capture("card_list_search_used", {
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

      posthog.capture("card_list_tag_toggled", {
        type,
        tag,
        selected: !prev.includes(tag),
        active_tags: updated,
      });

      return updated;
    });
  };

  const handleItemClick = (item: CardItem) => {
    posthog.capture("card_list_item_clicked", {
      type,
      slug: item.slug,
      title: item.title,
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
        </div>

        {showTags && allTags.length > 0 && (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 col-span-full">{emptyMessage}</p>
        ) : (
          filteredItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${type}/${item.slug}`}
              onClick={() => handleItemClick(item)}
              className="editorial-card rounded-[3px] group p-5 block border border-border transition-colors"
            >
              <div className="space-y-4">
                {(() => {
                  const readTimeText = showCardReadTime ? item.readTime : undefined;
                  const dateText = showCardDate ? item.date : undefined;
                  const inlineMetaText = [dateText, readTimeText].filter(Boolean).join(" · ");

                  if (metaInlineWithTitle && inlineMetaText) {
                    return (
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-medium text-foreground transition-colors font-serif text-xl leading-tight group-hover:text-primary">
                          {item.title}
                        </h2>
                        <span className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                          {inlineMetaText}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-medium text-foreground transition-colors font-serif text-2xl leading-[0.95] tracking-[-0.012em] group-hover:text-primary text-balance">
                          {item.title}
                        </h2>
                        {readTimeText && (
                          <span className="pt-1 text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground whitespace-nowrap">
                            {readTimeText}
                          </span>
                        )}
                      </div>
                      {dateText && (
                        <div className="text-[11px] tracking-[0.18em] uppercase font-mono text-muted-foreground">
                          {dateText}
                        </div>
                      )}
                    </>
                  );
                })()}

                <p className="line-clamp-2 text-[13px] leading-[1.45] text-muted-foreground">
                  {item.description ?? ""}
                </p>

                {showCardTags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={`${item.slug}-${tag}`}
                        className="px-2 py-1 text-[11px] tracking-wide rounded-[2px] border border-border text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {showImage && item.image && (
                <div className="mt-4 aspect-video rounded-[3px] overflow-hidden bg-muted relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
