import { getArticlesByCategory, getContentItem } from "./content";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  readTime: string;
  category: string;
};

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const [blogPosts, thoughtPosts] = await Promise.all([
    getArticlesByCategory("blog"),
    getArticlesByCategory("thoughts"),
  ]);

  return [...blogPosts, ...thoughtPosts]
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date || "",
      tags: post.tags,
      excerpt: post.excerpt,
      readTime: post.readTime,
      category: post.category,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<{
  slug: string;
  content: string;
} | null> {
  const blogPost = await getContentItem("blog", slug);

  if (blogPost) {
    return {
      slug,
      content: blogPost.content,
    };
  }

  const thoughtPost = await getContentItem("thoughts", slug);

  if (!thoughtPost) {
    return null;
  }

  return {
    slug,
    content: thoughtPost.content,
  };
}
