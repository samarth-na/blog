import Link from "next/link";

const POSTS = [
  { id: 1, title: "how i built my blog", date: "jan 28, 2026" },
  { id: 2, title: "lessons from 5 years of freelancing", date: "jan 15, 2026" },
  { id: 3, title: "why i switched to typescript", date: "jan 2, 2026" },
  { id: 4, title: "the tools i use", date: "dec 20, 2025" },
  { id: 5, title: "sample post one", date: "feb 12, 2026" },
  { id: 6, title: "sample post two", date: "feb 10, 2026" },
  { id: 7, title: "sample post three", date: "feb 8, 2026" },
];

const TAGS = ["javascript", "typescript", "react", "css", "design"];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <Link href="/" className="text-sm font-medium">alex</Link>
          </div>
          <nav className="flex gap-2 text-xs text-muted-foreground">
            <Link href="/demo" className="text-foreground">demo</Link>
            <span>/</span>
            <Link href="/1">l1</Link>
            <span>/</span>
            <Link href="/2">l2</Link>
            <span>/</span>
            <Link href="/3">l3</Link>
            <span>/</span>
            <Link href="/4">l4</Link>
            <span>/</span>
            <Link href="/5">l5</Link>
          </nav>
        </header>

        <main className="space-y-12">
          <section>
            <p className="text-xs text-muted-foreground mb-4">text elements</p>
            <div className="space-y-2 text-sm">
              <p><strong>bold text</strong> and <em>italic text</em> and <code>inline code</code></p>
              <p className="text-muted-foreground">muted/secondary text</p>
              <p className="text-xs">extra small text</p>
            </div>
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">links</p>
            <div className="flex gap-4 text-sm">
              <Link href="#" className="hover:text-primary">regular link</Link>
              <Link href="#" className="text-primary underline">primary link</Link>
            </div>
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">index</p>
            <ul className="space-y-1">
              {POSTS.map((post) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.id}`} className="group flex justify-between">
                    <span className="text-xs group-hover:text-primary">{post.title}</span>
                    <span className="text-xs text-muted-foreground">{post.date.slice(0, 6)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/tag/${tag}`}
                  className="px-2 py-1 text-xs border border-border hover:border-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-16 pt-6 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>© 2026</span>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">rss</Link>
              <Link href="#" className="hover:text-foreground">twitter</Link>
              <Link href="#" className="hover:text-foreground">github</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
