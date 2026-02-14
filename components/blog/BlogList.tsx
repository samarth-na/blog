"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Tag, List } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";

type BlogListProps = {
  posts: BlogPostMeta[];
};

export function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(true);
  const [viewMode, setViewMode] = useState<"full" | "minimal">("full");

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
  }, [posts]);

  // Filter posts based on search query and selected tags
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Check if post matches search query (search in title and excerpt)
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);

      // Check if post has all selected tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, posts]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[3px] px-4 py-3 bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          {/* Tags Toggle */}
          <button
            onClick={() => setShowTags(!showTags)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>{showTags ? "Hide tags" : "Show tags"}</span>
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={() =>
              setViewMode(viewMode === "full" ? "minimal" : "full")
            }
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <List className="w-4 h-4" />
            <span>{viewMode === "full" ? "Minimal view" : "Full view"}</span>
          </button>
        </div>

        {/* Tags Filter */}
        {showTags && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-sm border  rounded-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary hover:text-primary "
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts List */}
      <div
        className={`border-t border-border pt-8 ${viewMode === "full" ? "space-y-8" : "space-y-2"}`}
      >
        {filteredPosts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No posts found matching your criteria.
          </p>
        ) : viewMode === "full" ? (
          // Full View - Title, tags, date, read time, description
          filteredPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block space-y-2">
                {/* Title */}
                <h2 className="text-lg font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                {/* Meta line: [tags] · date · read time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {post.tags.length > 0 && (
                    <>
                      <span className="text-primary">
                        [{post.tags.join(", ")}]
                      </span>
                      <span>·</span>
                    </>
                  )}
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Description */}
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </article>
          ))
        ) : (
          // Minimal View - Title on left, date on right
          filteredPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {post.date}
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
