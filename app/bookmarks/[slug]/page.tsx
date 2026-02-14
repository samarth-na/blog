import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import fs from "fs";
import path from "path";
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
  table: (props: any) => (
    <div className="mdx-table-wrapper">
      <table className="mdx-table" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="mdx-thead" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="mdx-tr" {...props} />,
  th: (props: any) => <th className="mdx-th" {...props} />,
  td: (props: any) => <td className="mdx-td" {...props} />,
};

function getBookmark(slug: string): { slug: string; content: string; title: string; image?: string } | null {
  const filePath = path.join(process.cwd(), "content/bookmarks", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  
  // Parse frontmatter
  const titleMatch = fileContent.match(/^title:\s*([^\n]+)/m);
  const imageMatch = fileContent.match(/^image:\s*([^\n]+)/m);
  
  const title = titleMatch ? titleMatch[1].trim() : slug;
  const image = imageMatch ? imageMatch[1].trim() : undefined;
  
  const bodyContent = fileContent.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    title,
    image,
    content: bodyContent,
  };
}

export default async function BookmarkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bookmark = getBookmark(slug);

  if (!bookmark) {
    notFound();
  }

  return (
    <article>
      <div className="mb-4">
        <Link 
          href="/bookmarks" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← back to bookmarks
        </Link>
      </div>
      
      {bookmark.image && (
        <div className="aspect-video overflow-hidden bg-muted mb-6">
          <img
            src={bookmark.image}
            alt={bookmark.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <MDXRemote
        source={bookmark.content}
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
