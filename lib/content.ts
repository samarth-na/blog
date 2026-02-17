import { fetchContent, getContentFileList } from "./contentConfig";
import {
  parseFrontmatter,
  extractBody,
  getStringValue,
  type ParsedFrontmatter,
} from "./frontmatter";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
} & ParsedFrontmatter;

export type ContentConfigType = {
  directory: string;
  fields?: string[];
};

export async function getContentItems(
  contentType: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc"
): Promise<ContentItem[]> {
  const slugs = await getContentFileList(contentType);

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const content = await fetchContent(contentType, slug);
      if (!content) {
        return null;
      }

      const frontmatter = parseFrontmatter(content);

      return {
        slug,
        title: getStringValue(frontmatter, "title", slug),
        ...frontmatter,
      } as ContentItem;
    })
  );

  const filteredItems = items.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

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

export async function getContentItem(
  contentType: string,
  slug: string
): Promise<{ slug: string; content: string } & ParsedFrontmatter | null> {
  const content = await fetchContent(contentType, slug);

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
