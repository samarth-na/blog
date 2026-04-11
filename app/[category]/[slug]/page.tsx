import { BackToBlogLink } from "@/components/blog/BackToBlogLink";
import { getArticlesByCategory, getContentItem } from "@/lib/content";
import { urlSegmentToType } from "@/lib/typeConfig";
import { useMDXComponents as buildMDXComponents } from "@/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const [blogPosts, thoughtPosts, weeklogPosts] = await Promise.all([
    getArticlesByCategory("blog"),
    getArticlesByCategory("thoughts"),
    getArticlesByCategory("weeklog"),
  ]);

  return [...blogPosts, ...thoughtPosts, ...weeklogPosts].map((post) => ({
    category: post.category === "weeklog" ? "weeklogs" : post.category,
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const normalizedCategory = urlSegmentToType(category);
  const post = await getContentItem(normalizedCategory, slug);
  const mdxComponents = buildMDXComponents({});

  if (!post) {
    notFound();
  }

  const posts = await getArticlesByCategory(normalizedCategory, "date", "desc");
  const meta = posts.find((item) => item.slug === slug);

  if (!meta) {
    notFound();
  }

  return (
    <article>
      <div className="mb-4">
        <BackToBlogLink category={meta.category} />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 border-b border-muted-foreground pb-4">
        {meta.date && <span>{meta.date}</span>}
        {meta.readTime && (
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
