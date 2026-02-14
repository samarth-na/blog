import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => <h1 className="mdx-h1" {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 className="mdx-h2" {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 className="mdx-h3" {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 className="mdx-h4" {...props}>{children}</h4>,
    h5: ({ children, ...props }) => <h5 className="mdx-h5" {...props}>{children}</h5>,
    h6: ({ children, ...props }) => <h6 className="mdx-h6" {...props}>{children}</h6>,
    p: ({ children, ...props }) => <p className="mdx-p" {...props}>{children}</p>,
    a: ({ href, children, ...props }) => <Link href={href as string} className="mdx-a" {...props}>{children}</Link>,
    strong: ({ children, ...props }) => <strong className="mdx-strong" {...props}>{children}</strong>,
    em: ({ children, ...props }) => <em className="mdx-em" {...props}>{children}</em>,
    code: ({ children, ...props }) => <code className="mdx-code" {...props}>{children}</code>,
    pre: ({ children, ...props }) => <pre className="mdx-pre" {...props}>{children}</pre>,
    ul: ({ children, ...props }) => <ul className="mdx-ul" {...props}>{children}</ul>,
    ol: ({ children, ...props }) => <ol className="mdx-ol" {...props}>{children}</ol>,
    li: ({ children, ...props }) => <li className="mdx-li" {...props}>{children}</li>,
    blockquote: ({ children, ...props }) => <blockquote className="mdx-blockquote" {...props}>{children}</blockquote>,
    hr: (props) => <hr className="mdx-hr" {...props} />,
    table: ({ children, ...props }) => (
      <div className="mdx-table-wrapper">
        <table className="mdx-table" {...props}>{children}</table>
      </div>
    ),
    thead: ({ children, ...props }) => <thead className="mdx-thead" {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr className="mdx-tr" {...props}>{children}</tr>,
    th: ({ children, ...props }) => <th className="mdx-th" {...props}>{children}</th>,
    td: ({ children, ...props }) => <td className="mdx-td" {...props}>{children}</td>,
    ...components,
  };
}
