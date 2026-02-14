import fs from "fs";
import path from "path";

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

export function getBlogPosts(): BlogPostMeta[] {
  const postsDir = path.join(process.cwd(), "content/blog");
  
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(postsDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(content);
      const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, "");

      return {
        slug: file.replace(".mdx", ""),
        title: frontmatter.title || "",
        date: frontmatter.date || "",
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt,
        readTime: calculateReadTime(bodyContent),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): {
  slug: string;
  content: string;
} | null {
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const bodyContent = content.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    content: bodyContent,
  };
}
