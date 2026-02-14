import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";

const components = {
  h1: (props: any) => <h1 className="mdx-h1" {...props} />,
  h2: (props: any) => <h2 className="mdx-h2" {...props} />,
  h3: (props: any) => <h3 className="mdx-h3" {...props} />,
  h4: (props: any) => <h4 className="mdx-h4" {...props} />,
  h5: (props: any) => <h5 className="mdx-h5" {...props} />,
  h6: (props: any) => <h6 className="mdx-h6" {...props} />,
  p: (props: any) => <p className="mdx-p" {...props} />,
  a: (props: any) => (
    <Link href={props.href || "#"} className="mdx-a" {...props} />
  ),
  strong: (props: any) => <strong className="mdx-strong" {...props} />,
  em: (props: any) => <em className="mdx-em" {...props} />,
  code: (props: any) => <code className="mdx-code" {...props} />,
  pre: (props: any) => <pre className="mdx-pre" {...props} />,
  ul: (props: any) => <ul className="mdx-ul" {...props} />,
  ol: (props: any) => <ol className="mdx-ol" {...props} />,
  li: (props: any) => <li className="mdx-li" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="mdx-blockquote" {...props} />
  ),
  hr: (props: any) => <hr className="mdx-hr" {...props} />,
  table: (props: any) => <table className="mdx-table" {...props} />,
  thead: (props: any) => <thead className="mdx-thead" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="mdx-tr" {...props} />,
  th: (props: any) => <th className="mdx-th" {...props} />,
  td: (props: any) => <td className="mdx-td" {...props} />,
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Get post metadata from the full list
  const posts = getBlogPosts();
  const meta = posts.find((p) => p.slug === slug);

  return (
    <article>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 border-b border-muted-foreground pb-4">
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
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </article>
  );
}
