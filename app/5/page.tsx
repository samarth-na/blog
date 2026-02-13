import Link from "next/link";

const POSTS = [
  { id: 1, title: "understanding react server components", date: "feb 12", tags: ["react", "next.js"] },
  { id: 2, title: "a better css architecture", date: "feb 9", tags: ["css", "architecture"] },
  { id: 3, title: "typescript for beginners", date: "feb 6", tags: ["typescript", "guide"] },
  { id: 4, title: "performance tips for web apps", date: "feb 3", tags: ["performance"] },
  { id: 5, title: "why accessibility matters", date: "jan 30", tags: ["a11y", "design"] },
];

const TAGS = ["all", "react", "typescript", "css", "design", "performance"];

export default function Layout5Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex justify-between items-baseline pb-4 border-b border-border">
            <span className="text-sm">alex.dev</span>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Link href="/demo">demo</Link>
              <span>|</span>
              <Link href="/1">l1</Link>
              <span>|</span>
              <Link href="/2">l2</Link>
              <span>|</span>
              <Link href="/3">l3</Link>
              <span>|</span>
              <Link href="/4">l4</Link>
              <span>|</span>
              <Link href="/5" className="text-foreground">l5</Link>
            </div>
          </div>
        </header>

        <main>
          <div className="mb-8 flex gap-2 text-xs text-muted-foreground overflow-x-auto">
            {TAGS.map((tag) => (
              <button 
                key={tag}
                className={`px-2 py-1 border border-border hover:border-foreground transition-colors ${tag === 'all' ? 'bg-foreground text-background' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <section>
            {POSTS.map((post, i) => (
              <article key={post.id} className="py-4 border-b border-border/40">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-xs text-muted-foreground font-mono">{post.date}</span>
                  <Link href={`/blog/${post.id}`} className="text-sm hover:text-primary">
                    {post.title}
                  </Link>
                </div>
                <div className="flex gap-2 ml-[4.5rem]">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-primary">#{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <footer className="mt-12 pt-6 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>© 2026</span>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-foreground">rss</Link>
                <Link href="#" className="hover:text-foreground">twitter</Link>
                <Link href="#" className="hover:text-foreground">github</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
