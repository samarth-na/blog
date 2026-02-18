import { fetchContent, getContentFileList } from "./contentConfig";
import {
  parseFrontmatter,
  extractBody,
  getStringValue,
  getArrayValue,
} from "./frontmatter";

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

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const slugs = await getContentFileList("blog");

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await fetchContent("blog", slug);
      if (!content) {
        return null;
      }

      const frontmatter = parseFrontmatter(content);
      const bodyContent = extractBody(content);

      const excerptValue = getStringValue(frontmatter, "excerpt");

      return {
        slug,
        title: getStringValue(frontmatter, "title"),
        date: getStringValue(frontmatter, "date"),
        tags: getArrayValue(frontmatter, "tags"),
        excerpt: excerptValue || undefined,
        readTime: getStringValue(frontmatter, "read") || calculateReadTime(bodyContent),
      };
    })
  );

  return posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
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

  return {
    slug,
    content: extractBody(content),
  };
}
