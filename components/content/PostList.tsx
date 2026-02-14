import Link from "next/link";

export interface PostItem {
  id: number;
  title: string;
  date: string;
  words?: number;
}

interface PostListProps {
  posts: PostItem[];
  showWords?: boolean;
}

export function BlogPostList({ posts, showWords = false }: PostListProps) {
  return (
    <ul className="space-y-1">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={`/blog/${post.id}`}
            className="group flex justify-between"
          >
            <span className="text-xs group-hover:text-primary">
              {post.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {showWords ? `${post.words} words` : post.date.slice(0, 6)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
