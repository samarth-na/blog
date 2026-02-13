import Link from "next/link";

const POSTS = [
  { id: 1, title: "getting started", date: "feb 12", read: "3 min" },
  { id: 2, title: "clean code principles", date: "feb 10", read: "5 min" },
  { id: 3, title: "accessibility basics", date: "feb 8", read: "4 min" },
  { id: 4, title: "typescript tips", date: "feb 5", read: "6 min" },
];

export default function Layout3Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-xs font-mono text-muted-foreground">nav</span>
            <div className="flex gap-3 text-xs">
              <Link href="/demo" className="hover:text-foreground">demo</Link>
              <Link href="/1" className="hover:text-foreground">l1</Link>
              <Link href="/2" className="hover:text-foreground">l2</Link>
              <Link href="/3" className="text-foreground">l3</Link>
              <Link href="/4" className="hover:text-foreground">l4</Link>
              <Link href="/5" className="hover:text-foreground">l5</Link>
            </div>
          </div>
        </header>

        <main>
          <section className="mb-8">
            <p className="text-xs text-muted-foreground mb-2">about</p>
            <p className="text-sm">developer based in sf. i build things and write about it.</p>
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-4">posts</p>
            {POSTS.map((post, i) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.id}`}
                className="block py-3 border-b border-border/20 group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm group-hover:text-primary transition-colors">{post.title}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
              </Link>
            ))}
          </section>
        </main>

        <footer className="mt-16 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>alex dev</span>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">tw</Link>
              <Link href="#" className="hover:text-foreground">gh</Link>
              <Link href="#" className="hover:text-foreground">mail</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
