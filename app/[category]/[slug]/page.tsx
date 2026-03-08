import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { BackToBlogLink } from "@/components/blog/BackToBlogLink";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { getBlogPost, getBlogPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const posts = await getBlogPosts();
  const meta = posts.find((p) => p.slug === slug);

  return (
    <article>
      <div className="mb-4">
        <BackToBlogLink category={meta?.category} />
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
