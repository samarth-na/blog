import Link from "next/link";

interface TagsProps {
  tags: string[];
  baseUrl?: string;
}

export function BlogTags({ tags, baseUrl = "/tag" }: TagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`${baseUrl}/${tag}`}
          className="px-2 py-1 text-xs border border-border hover:border-foreground"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
