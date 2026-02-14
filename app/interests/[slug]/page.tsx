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

function getInterest(slug: string): { slug: string; content: string; title: string } | null {
  const filePath = path.join(process.cwd(), "content/interests", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  
  // Parse title from frontmatter
  const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?/m);
  const title = titleMatch ? titleMatch[1] : slug;
  
  const bodyContent = content.replace(/^---[\s\S]*?---\n/, "");

  return {
    slug,
    title,
    content: bodyContent,
  };
}

export default async function InterestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interest = getInterest(slug);

  if (!interest) {
    notFound();
  }

  return (
    <article>
      <div className="mb-4">
        <a 
          href="/interests" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← back to interests
        </a>
      </div>
      <MDXRemote
        source={interest.content}
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
