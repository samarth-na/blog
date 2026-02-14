import fs from "fs";
import path from "path";
import { BookmarkList } from "@/components/bookmarks/BookmarkList";

export type Bookmark = {
  slug: string;
  title: string;
  image: string;
  description?: string;
};

function getBookmarks(): Bookmark[] {
  const bookmarksDir = path.join(process.cwd(), "content/bookmarks");
  
  if (!fs.existsSync(bookmarksDir)) {
    return [];
  }
  
  const files = fs.readdirSync(bookmarksDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(bookmarksDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(content);

      return {
        slug: file.replace(".mdx", ""),
        title: frontmatter.title || "",
        image: frontmatter.image || "",
        description: frontmatter.description,
      };
    });
}

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

export default function BookmarksPage() {
  const bookmarks = getBookmarks();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "'IBM Plex Serif', serif" }}>Bookmarks</h1>
      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
}
