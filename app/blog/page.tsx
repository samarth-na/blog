import { getBlogPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/BlogList";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-medium"
        style={{ fontFamily: "'IBM Plex Serif', serif" }}
      >
        Blog
      </h1>
      <BlogList posts={posts} />
    </div>
  );
}
