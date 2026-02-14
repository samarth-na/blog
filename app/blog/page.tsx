import fs from "fs";
import path from "path";
import Link from "next/link";

type BlogPost = {
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

function getBlogPosts(): BlogPost[] {
  const postsDir = path.join(process.cwd(), "content/blog");
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

function parseFrontmatter(content: string): {
  title?: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
} {
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

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium mb-8">Blog</h1>
      
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block space-y-2">
              {/* Title */}
              <h2 className="text-lg font-medium group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              
              {/* Meta line: [tags] · date · read time */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {post.tags.length > 0 && (
                  <>
                    <span className="text-primary">
                      [{post.tags.join(", ")}]
                    </span>
                    <span>·</span>
                  </>
                )}
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              
              {/* Description */}
              {post.excerpt && (
                <p className="text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
