import type { ContentItem } from "@/lib/content";

export type Bookmark = {
  slug: string;
  title: string;
  image: string;
  tags: string[];
  description?: string;
};

/**
 * Converts ContentItem from lib/content to Bookmark type
 */
export function toBookmark(item: ContentItem): Bookmark {
  return {
    slug: item.slug,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image || "",
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    description: Array.isArray(item.description)
      ? item.description[0]
      : item.description,
  };
}
