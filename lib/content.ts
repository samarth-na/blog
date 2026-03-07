import { fetchContent, getContentFileList } from "./contentConfig";
import {
  extractBody,
  getArrayValue,
  getStringValue,
  type ParsedFrontmatter,
  parseFrontmatter,
} from "./frontmatter";

export type ContentItem = {
  slug: string;
  title: string;
  type: string;
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
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc",
): Promise<ContentItem[]> {
  const slugs = await getContentFileList();

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const content = await fetchContent(slug);
      if (!content) {
        return null;
      }

      const frontmatter = parseFrontmatter(content);
      const type = getStringValue(frontmatter, "type", "blog");
      const bodyContent = extractBody(content);

      return {
        slug,
        title: getStringValue(frontmatter, "title", slug),
        type,
        date: getStringValue(frontmatter, "date"),
        tags: getArrayValue(frontmatter, "tags"),
        excerpt: getStringValue(frontmatter, "excerpt") || undefined,
        readTime: getStringValue(frontmatter, "read") || calculateReadTime(bodyContent),
        ...frontmatter,
      } as ContentItem;
    }),
  );

  const filteredItems = items.filter((item): item is NonNullable<typeof item> => item !== null);

  if (sortBy) {
    filteredItems.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      aVal = Array.isArray(aVal) ? aVal[0] : aVal;
      bVal = Array.isArray(bVal) ? bVal[0] : bVal;

      aVal = aVal || "";
      bVal = bVal || "";

      const aDate = new Date(aVal);
      const bDate = new Date(bVal);

      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortOrder === "desc"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      }

      return sortOrder === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
  }

  return filteredItems;
}

export async function getArticlesByType(
  type: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc",
): Promise<ContentItem[]> {
  const items = await getContentItems(sortBy, sortOrder);
  return items.filter((item) => item.type === type);
}

export async function getContentItem(
  slug: string,
): Promise<({ slug: string; content: string } & ParsedFrontmatter) | null> {
  const content = await fetchContent(slug);

  if (!content) {
    return null;
  }

  const frontmatter = parseFrontmatter(content);
  const bodyContent = extractBody(content);

  return {
    slug,
    content: bodyContent,
    ...frontmatter,
  };
}
