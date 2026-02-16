import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { BackToBlogLink } from "@/components/blog/BackToBlogLink";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Get post metadata from the full list
  const posts = await getBlogPosts();
  const meta = posts.find((p) => p.slug === slug);

  return (
    <article>
      <div className="mb-4">
        <BackToBlogLink slug={slug} />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 border-b border-muted-foreground pb-4">
        {meta?.date && <span>{meta.date}</span>}
        {meta?.readTime && (
          <>
            <span>·</span>
            <span>{meta.readTime}</span>
          </>
        )}
      </div>
      <MDXRemote
        source={post.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </article>
  );
}
