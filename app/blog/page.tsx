import fs from "fs";
import path from "path";
import Link from "next/link";
import "../globals.css";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
};

function getBlogPosts(): BlogPost[] {
  const postsDir = path.join(process.cwd(), "content/blog");
  const files = fs.readdirSync(postsDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(content);
      return {
        slug: file.replace(".mdx", ""),
        title: frontmatter.title || "",
        date: frontmatter.date || "",
        excerpt: frontmatter.excerpt,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const frontmatter: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...value] = line.split(":");
    if (key && value) {
      frontmatter[key.trim()] = value.join(":").trim();
    }
  });

  return frontmatter;
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="prose prose-sm max-w-none">
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="mdx-a">
              {post.title}
            </Link>
            <span className="text-muted-foreground text-sm ml-2">
              {post.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
