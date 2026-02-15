import { fetchContent, getContentFileList } from "./contentConfig";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
  [key: string]: string | string[] | undefined;
};

export type ContentConfigType = {
  directory: string;
  fields?: string[];
};

function parseFrontmatter(content: string): Record<string, string | string[]> {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const frontmatter: Record<string, string | string[]> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

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
        title: (frontmatter.title as string) || slug,
        ...frontmatter,
      } as ContentItem;
    })
  );

  const filteredItems = items.filter((item): item is ContentItem => item !== null);

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
): Promise<{ slug: string; content: string; [key: string]: string | string[] } | null> {
  const content = await fetchContent(contentType, slug);

  if (!content) {
    return null;
  }

  const frontmatter = parseFrontmatter(content);
  const bodyContent = content.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    content: bodyContent,
    ...frontmatter,
  };
}
