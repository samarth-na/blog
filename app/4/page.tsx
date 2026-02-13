import Link from "next/link";

const POSTS = [
  { id: 1, title: "how i built my blog", date: "jan 28, 2026" },
  { id: 2, title: "lessons from 5 years of freelancing", date: "jan 15, 2026" },
  { id: 3, title: "why i switched to typescript", date: "jan 2, 2026" },
  { id: 4, title: "the tools i use", date: "dec 20, 2025" },
];

const LINKS = [
  { label: "about", href: "#" },
  { label: "projects", href: "#" },
  { label: "writing", href: "#" },
  { label: "contact", href: "#" },
];

export default function Layout4Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-6 py-12">
        <header className="mb-16">
          <nav className="flex gap-4 text-sm">
            <Link
              href="/demo"
              className="text-muted-foreground hover:text-foreground"
            >
              demo
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/1" className="text-foreground">
              l1
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/2"
              className="text-muted-foreground hover:text-foreground"
            >
              l2
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/3"
              className="text-muted-foreground hover:text-foreground"
            >
              l3
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/4"
              className="text-muted-foreground hover:text-foreground"
            >
              l4
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/5"
              className="text-muted-foreground hover:text-foreground"
            >
              l5
            </Link>
          </nav>
        </header>
        <header className="mb-12 pb-8 border-b border-border">
          <nav className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <main>
          <div className="mb-10">
            <p className="text-xs text-muted-foreground">index</p>
            <ul className="mt-3 space-y-1">
              {POSTS.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.id}`}
                    className="group flex justify-between"
                  >
                    <span className="text-xs group-hover:text-primary">
                      {post.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.date.slice(0, 6)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">connect</p>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                twitter
              </Link>
              <Link href="#" className="hover:text-foreground">
                github
              </Link>
              <Link href="#" className="hover:text-foreground">
                linkedin
              </Link>
              <Link href="#" className="hover:text-foreground">
                email
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
