import Link from "next/link";

interface ArticleViewProps {
  title: string;
  date?: string;
  category?: string;
  readTime?: string;
  content: string[];
}

export function BlogArticleView({ title, date, category, readTime, content }: ArticleViewProps) {
  return (
    <article>
      <h1 className="text-sm font-medium mb-2">{title}</h1>
      <div className="flex gap-3 text-xs text-muted-foreground mb-6">
        {date && <span>{date}</span>}
        {category && (
          <>
            <span>·</span>
            <span className="text-primary">[{category}]</span>
          </>
        )}
        {readTime && (
          <>
            <span>·</span>
            <span>{readTime}</span>
          </>
        )}
      </div>
      <div className="space-y-4 text-sm">
        {content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
