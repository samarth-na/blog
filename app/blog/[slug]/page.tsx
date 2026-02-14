import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";

const components = {
  h1: (props: any) => <h1 className="mdx-h1" {...props} />,
  h2: (props: any) => <h2 className="mdx-h2" {...props} />,
  h3: (props: any) => <h3 className="mdx-h3" {...props} />,
  h4: (props: any) => <h4 className="mdx-h4" {...props} />,
  h5: (props: any) => <h5 className="mdx-h5" {...props} />,
  h6: (props: any) => <h6 className="mdx-h6" {...props} />,
  p: (props: any) => <p className="mdx-p" {...props} />,
  a: (props: any) => <Link href={props.href || "#"} className="mdx-a" {...props} />,
  strong: (props: any) => <strong className="mdx-strong" {...props} />,
  em: (props: any) => <em className="mdx-em" {...props} />,
  code: (props: any) => <code className="mdx-code" {...props} />,
  pre: (props: any) => <pre className="mdx-pre" {...props} />,
  ul: (props: any) => <ul className="mdx-ul" {...props} />,
  ol: (props: any) => <ol className="mdx-ol" {...props} />,
  li: (props: any) => <li className="mdx-li" {...props} />,
  blockquote: (props: any) => <blockquote className="mdx-blockquote" {...props} />,
  hr: (props: any) => <hr className="mdx-hr" {...props} />,
  table: (props: any) => <table className="mdx-table" {...props} />,
  thead: (props: any) => <thead className="mdx-thead" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="mdx-tr" {...props} />,
  th: (props: any) => <th className="mdx-th" {...props} />,
  td: (props: any) => <td className="mdx-td" {...props} />,
};

function parseFrontmatter(content: string): { title: string; date: string; excerpt?: string; content: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { title: "", date: "", content };
  
  const frontmatter: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...value] = line.split(":");
    if (key && value) {
      frontmatter[key.trim()] = value.join(":").trim();
    }
  });
  
  return {
    title: frontmatter.title || "",
    date: frontmatter.date || "",
    excerpt: frontmatter.excerpt,
    content: content.slice(match[0].length),
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);
  const content = fs.readFileSync(filePath, "utf8");
  const { title, date, excerpt, content: mdxContent } = parseFrontmatter(content);

  return (
    <article className="prose prose-sm max-w-none">
      <h1 className="mdx-h1">{title}</h1>
      <p className="text-muted-foreground">{date}</p>
      <MDXRemote
        source={mdxContent}
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
