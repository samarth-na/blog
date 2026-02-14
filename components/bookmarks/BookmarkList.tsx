"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Bookmark } from "@/app/bookmarks/page";

type BookmarkListProps = {
  bookmarks: Bookmark[];
};

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((bookmark) => {
      const matchesSearch =
        searchQuery === "" ||
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bookmark.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      return matchesSearch;
    });
  }, [searchQuery, bookmarks]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-[3px] w-full px-4 py-3 bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBookmarks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 col-span-full">
            No bookmarks found matching your search.
          </p>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <Link
              key={bookmark.slug}
              href={`/bookmarks/${bookmark.slug}`}
              className="rounded-[3px] group p-4 block border border-border hover:border-foreground transition-colors overflow-hidden h-[320px] w-full"
            >
              <h2 className=" font-medium text-primary transition-colors">
                {bookmark.title}
              </h2>

              {bookmark.description && (
                <p className="text-xs text-muted-foreground pb-6.5 line-clamp-2">
                  {bookmark.description}
                </p>
              )}
              {bookmark.image && (
                <div className="h-[220px] rounded-[3px] overflow-hidden bg-muted">
                  <img
                    src={bookmark.image}
                    alt={bookmark.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
