"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Tag } from "lucide-react";
import type { Bookmark } from "@/types/bookmark";
import posthog from "posthog-js";

type BookmarkListProps = {
  bookmarks: Bookmark[];
};

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(true);

  const allTags = useMemo(() => {
    return Array.from(
      new Set(bookmarks.flatMap((bookmark) => bookmark.tags))
    ).sort();
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      const matchesSearch =
        searchQuery === "" ||
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bookmark.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => bookmark.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, bookmarks]);

  useEffect(() => {
    if (!searchQuery) return;

    const timeout = setTimeout(() => {
      posthog.capture("bookmark_search_used", {
        query: searchQuery,
        results: filteredBookmarks.length,
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchQuery, filteredBookmarks.length]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const updated = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      posthog.capture("bookmark_tag_toggled", {
        tag,
        selected: !prev.includes(tag),
        active_tags: updated,
      });

      return updated;
    });
  };

  const handleBookmarkClick = (bookmark: Bookmark) => {
    posthog.capture("bookmark_clicked", {
      slug: bookmark.slug,
      title: bookmark.title,
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search bookmarks..."
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
        {filteredBookmarks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 col-span-full">
            No bookmarks found matching your criteria.
          </p>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <Link
              key={bookmark.slug}
              href={`/bookmarks/${bookmark.slug}`}
              onClick={() => handleBookmarkClick(bookmark)}
              className="rounded-[3px] group p-4 block border border-border hover:border-foreground transition-colors"
            >
              <div className="space-y-3">
                <h2 className="font-medium text-primary transition-colors">
                  {bookmark.title}
                </h2>

                {bookmark.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {bookmark.description}
                  </p>
                )}
              </div>

              {bookmark.image && (
                <div className="mt-3 aspect-video rounded-[3px] overflow-hidden bg-muted relative">
                  <Image
                    src={bookmark.image}
                    alt={bookmark.title}
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
