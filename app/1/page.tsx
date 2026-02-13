import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";

const POSTS = [
  { id: 1, title: "getting started with next.js", date: "feb 12, 2026", words: 850 },
  { id: 2, title: "writing clean code", date: "feb 10, 2026", words: 1200 },
  { id: 3, title: "designing for accessibility", date: "feb 8, 2026", words: 950 },
  { id: 4, title: "typescript generics explained", date: "feb 5, 2026", words: 1500 },
  { id: 5, title: "building a design system", date: "feb 3, 2026", words: 1100 },
];

export default function Layout1Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-16">
          <nav className="flex gap-4 text-sm">
            <Link href="/demo" className="text-muted-foreground hover:text-foreground">demo</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/1" className="text-foreground">l1</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/2" className="text-muted-foreground hover:text-foreground">l2</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/3" className="text-muted-foreground hover:text-foreground">l3</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/4" className="text-muted-foreground hover:text-foreground">l4</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/5" className="text-muted-foreground hover:text-foreground">l5</Link>
          </nav>
        </header>

        <main>
          <h1 className="text-sm font-medium mb-12">alex dev — writing about code</h1>

          <section>
            {POSTS.map((post, i) => (
              <div key={post.id}>
                <Link href={`/blog/${post.id}`} className="block py-3 group">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-sm group-hover:text-primary transition-colors">{post.title}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{post.date}</span>
                  </div>
                </Link>
                {i < POSTS.length - 1 && <Separator className="bg-border/50" />}
              </div>
            ))}
          </section>

          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex gap-6 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground">twitter</Link>
              <Link href="#" className="hover:text-foreground">github</Link>
              <Link href="#" className="hover:text-foreground">rss</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
