import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import { contentConfig } from "@/lib/contentConfig";

export type Bookmark = {
  slug: string;
  title: string;
  image: string;
  tags: string[];
  description?: string;
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
    const value = line.slice(colonIndex + 1).trim();

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

async function getBookmarks(): Promise<Bookmark[]> {
  const url = `https://api.github.com/repos/${contentConfig.repo}/contents/bookmarks`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const slugs = data
    .filter((file: { name: string }) => file.name.endsWith(".mdx"))
    .map((file: { name: string }) => file.name.replace(".mdx", ""));

  const bookmarks = await Promise.all(
    slugs.map(async (slug: string) => {
      const contentUrl = `${contentConfig.baseUrl}/bookmarks/${slug}.mdx`;
      const contentResponse = await fetch(contentUrl);
      
      if (!contentResponse.ok) {
        return null;
      }

      const content = await contentResponse.text();
      const frontmatter = parseFrontmatter(content);

      const title = Array.isArray(frontmatter.title) ? frontmatter.title[0] : frontmatter.title;
      const image = Array.isArray(frontmatter.image) ? frontmatter.image[0] : frontmatter.image;
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

      return {
        slug,
        title: title || "",
        image: image || "",
        tags: tags,
        description: frontmatter.description as string | undefined,
      };
    })
  );

  return bookmarks.filter((b): b is Bookmark => b !== null);
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
