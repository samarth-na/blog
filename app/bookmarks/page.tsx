import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import { getContentItems } from "@/lib/content";
import { toBookmark, type Bookmark } from "@/types/bookmark";

async function getBookmarks(): Promise<Bookmark[]> {
  const items = await getContentItems("bookmarks", "title", "asc");
  return items.map(toBookmark);
}

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium font-serif">Bookmarks</h1>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
}

// Re-export type for components
export type { Bookmark } from "@/types/bookmark";
