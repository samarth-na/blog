import Link from "next/link";

const POSTS = [
  { id: 1, title: "sample post one", date: "feb 12, 2026", words: 500 },
  { id: 2, title: "sample post two", date: "feb 10, 2026", words: 750 },
  { id: 3, title: "sample post three", date: "feb 8, 2026", words: 600 },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-16">
          <nav className="flex gap-4 text-xs text-muted-foreground mb-8">
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
          <h1 className="text-sm font-medium">component demo</h1>
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
            <p className="text-xs text-muted-foreground mb-4">post list (connected borders)</p>
            {POSTS.map((post, i) => (
              <div key={post.id}>
                <Link href={`/blog/${post.id}`} className="block py-3 group">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm group-hover:text-primary">{post.title}</span>
                    <span className="text-xs text-muted-foreground">{post.words} words</span>
                  </div>
                </Link>
                {i < POSTS.length - 1 && <div className="h-px bg-border/50" />}
              </div>
            ))}
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">tags</p>
            <div className="flex flex-wrap gap-2">
              {["javascript", "typescript", "react", "css", "design"].map((tag) => (
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

          <section>
            <p className="text-xs text-muted-foreground mb-4">footer</p>
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>© 2026</span>
                <div className="flex gap-4">
                  <Link href="#">twitter</Link>
                  <Link href="#">github</Link>
                  <Link href="#">rss</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
