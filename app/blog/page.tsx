import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import { getContentItems } from "@/lib/content";
import { toBookmark, type Bookmark } from "@/types/bookmark";

async function getBlogPosts(): Promise<Bookmark[]> {
  const items = await getContentItems("blog", "title", "asc");
  return items.map(toBookmark);
}

export default async function BlogPage() {
  const bookmarks = await getBlogPosts();

  return (
    <div className="space-y-8 animate-fade-in-down">
      <h1 className="text-2xl font-medium font-serif">Blog</h1>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
}

// Re-export type for components
export type { Bookmark } from "@/types/bookmark";
