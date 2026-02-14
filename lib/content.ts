import fs from "fs";
import path from "path";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
  [key: string]: string | string[] | undefined;
};

export type ContentConfig = {
  directory: string;
  fields?: string[];
};

function parseFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const frontmatter: Record<string, any> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays like tags: [item1, item2]
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

export function getContentItems(
  contentType: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc"
): ContentItem[] {
  const contentDir = path.join(process.cwd(), `content/${contentType}`);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);

  const items: ContentItem[] = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(content);

      return {
        slug: file.replace(".mdx", ""),
        title: frontmatter.title || file.replace(".mdx", ""),
        ...frontmatter,
      } as ContentItem;
    });

  // Sort items
  if (sortBy) {
    items.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle arrays (use first element or empty string)
      aVal = Array.isArray(aVal) ? aVal[0] : aVal;
      bVal = Array.isArray(bVal) ? bVal[0] : bVal;
      
      // Default to empty string if undefined
      aVal = aVal || "";
      bVal = bVal || "";
      
      // Try to parse as dates
      const aDate = new Date(aVal);
      const bDate = new Date(bVal);
      
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortOrder === "desc" 
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      }
      
      // Fallback to string comparison
      return sortOrder === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
  }

  return items;
}

export function getContentItem(
  contentType: string,
  slug: string
): { slug: string; content: string; [key: string]: any } | null {
  const filePath = path.join(process.cwd(), `content/${contentType}`, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const frontmatter = parseFrontmatter(fileContent);
  const bodyContent = fileContent.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    content: bodyContent,
    ...frontmatter,
  };
}
