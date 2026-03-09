import { getContentEntries } from "./contentConfig";
import { extractBody, getArrayValue, getStringValue, type ParsedFrontmatter } from "./frontmatter";

export type ContentItem = {
  slug: string;
  title: string;
  category: string;
  date?: string;
  tags: string[];
  excerpt?: string;
  readTime: string;
} & ParsedFrontmatter;

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getContentItems(
  contentType: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc",
): Promise<ContentItem[]> {
  const items = (await getContentEntries(contentType)).map((entry) => {
    const { frontmatter, slug, content } = entry;
    const category = getStringValue(frontmatter, "category", contentType);
    const bodyContent = extractBody(content);

    return {
      slug,
      title: getStringValue(frontmatter, "title", slug),
      category,
      date: getStringValue(frontmatter, "date"),
      tags: getArrayValue(frontmatter, "tags"),
      excerpt: getStringValue(frontmatter, "excerpt") || undefined,
      readTime: getStringValue(frontmatter, "read") || calculateReadTime(bodyContent),
      ...frontmatter,
    } as ContentItem;
  });

  if (sortBy) {
    items.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      aVal = Array.isArray(aVal) ? aVal[0] : aVal;
      bVal = Array.isArray(bVal) ? bVal[0] : bVal;

      aVal = aVal || "";
      bVal = bVal || "";

      const aDate = new Date(aVal);
      const bDate = new Date(bVal);

      if (!Number.isNaN(aDate.getTime()) && !Number.isNaN(bDate.getTime())) {
        return sortOrder === "desc"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      }

      return sortOrder === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
  }

  return items;
}

export async function getArticlesByCategory(
  category: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc",
): Promise<ContentItem[]> {
  return getContentItems(category, sortBy, sortOrder);
}

export async function getContentItem(
  contentType: string,
  slug: string,
): Promise<({ slug: string; content: string } & ParsedFrontmatter) | null> {
  const entry = (await getContentEntries(contentType)).find((item) => item.slug === slug);

  if (!entry) {
    return null;
  }

  return {
    slug,
    content: extractBody(entry.content),
    ...entry.frontmatter,
  };
}
