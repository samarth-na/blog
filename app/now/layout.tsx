import Link from "next/link";
import type { MDXComponents } from "mdx/types";

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

export function useMDXComponents(componentsFromProps: MDXComponents): MDXComponents {
  return {
    ...components,
    ...componentsFromProps,
  };
}

export default function NowLayout({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-sm max-w-none">{children}</div>;
}
