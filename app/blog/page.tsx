import { getBlogPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/BlogList";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-medium font-serif"
      >
        Blog
      </h1>
      <BlogList posts={posts} />
    </div>
  );
}
