import Link from "next/link";

const POSTS = [
  { id: 1, title: "the future of web development", date: "2026-02-12", category: "thoughts" },
  { id: 2, title: "mastering css grid and flexbox", date: "2026-02-10", category: "tutorial" },
  { id: 3, title: "building accessible components", date: "2026-02-08", category: "guide" },
  { id: 4, title: "state management in 2026", date: "2026-02-05", category: "thoughts" },
  { id: 5, title: "on learning new things", date: "2026-02-01", category: "personal" },
];

export default function Layout2Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-16">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <Link href="/" className="text-sm font-medium">alex</Link>
          </div>
          <nav className="flex gap-2 text-xs text-muted-foreground">
            <Link href="/demo">demo</Link>
            <span>/</span>
            <Link href="/1">l1</Link>
            <span>/</span>
            <Link href="/2" className="text-foreground">l2</Link>
            <span>/</span>
            <Link href="/3">l3</Link>
            <span>/</span>
            <Link href="/4">l4</Link>
            <span>/</span>
            <Link href="/5">l5</Link>
          </nav>
        </header>

        <main className="space-y-0">
          <p className="text-xs text-muted-foreground mb-8">notes on code, design, and everything in between</p>

          {POSTS.map((post, i) => (
            <article key={post.id} className="py-4 border-b border-border/30">
              <div className="flex gap-3 items-baseline">
                <span className="text-xs text-muted-foreground font-mono">{post.date}</span>
                <span className="text-xs text-primary">[{post.category}]</span>
              </div>
              <Link href={`/blog/${post.id}`} className="block mt-1">
                <h2 className="text-sm hover:text-primary transition-colors">{post.title}</h2>
              </Link>
            </article>
          ))}
        </main>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">© 2026 alex dev</p>
        </footer>
      </div>
    </div>
  );
}
