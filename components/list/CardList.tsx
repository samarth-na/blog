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
};

export function CardList({
  items,
  type,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found matching your criteria.",
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
              className="rounded-[3px] group p-4 block border border-border hover:border-foreground transition-colors"
            >
              <div className="space-y-3">
                <h2 className="font-medium text-primary transition-colors">{item.title}</h2>

                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                )}
              </div>

              {item.image && (
                <div className="mt-3 aspect-video rounded-[3px] overflow-hidden bg-muted relative">
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
