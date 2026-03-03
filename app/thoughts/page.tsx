import { getBlogPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/BlogList";

export default async function ThoughtsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-8 animate-fade-in-down">
      <h1 className="text-2xl font-medium font-serif">Thoughts</h1>
      <BlogList posts={posts} />
    </div>
  );
}
