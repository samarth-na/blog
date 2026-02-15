import { fetchContent, getContentFileList } from "./contentConfig";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  readTime: string;
};

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

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

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const slugs = await getContentFileList("blog");

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await fetchContent("blog", slug);
      if (!content) {
        return null;
      }

      const frontmatter = parseFrontmatter(content);
      const bodyContent = content.replace(/^---[\s\S]*?\n---\n/, "");

      const title = Array.isArray(frontmatter.title) ? frontmatter.title[0] : frontmatter.title;
      const date = Array.isArray(frontmatter.date) ? frontmatter.date[0] : frontmatter.date;
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
      const excerpt = Array.isArray(frontmatter.excerpt) ? frontmatter.excerpt[0] : frontmatter.excerpt;

      return {
        slug,
        title: title || "",
        date: date || "",
        tags: tags,
        excerpt: excerpt || "",
        readTime: calculateReadTime(bodyContent),
      } as BlogPostMeta;
    })
  );

  return posts
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<{
  slug: string;
  content: string;
} | null> {
  const content = await fetchContent("blog", slug);

  if (!content) {
    return null;
  }

  const bodyContent = content.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    content: bodyContent,
  };
}
