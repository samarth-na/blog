import { BlogHeader } from "@/components/layout/Header";
import Link from "next/link";

const POSTS = [
  { id: 1, title: "sample post one", date: "feb 12, 2026", words: 500 },
  { id: 2, title: "sample post two", date: "feb 10, 2026", words: 750 },
  { id: 3, title: "sample post three", date: "feb 8, 2026", words: 600 },
];

const CATEGORIES = [
  "development",
  "design",
  "tutorial",
  "thoughts",
  "personal",
];
const SOCIALS = ["twitter", "github", "linkedin", "email", "rss"];

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BlogHeader currentPath="/test" />

        <main className="space-y-16">
          {/* Article / Post View */}
          <section>
            <p className="text-xs text-muted-foreground mb-6">article view</p>
            <article>
              <h1 className="text-sm font-medium mb-2">
                how to build a blog with next.js
              </h1>
              <div className="flex gap-3 text-xs text-muted-foreground mb-6">
                <span>feb 12, 2026</span>
                <span>·</span>
                <span className="text-primary">[development]</span>
                <span>·</span>
                <span>5 min read</span>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  This is the body of a blog post. It contains multiple
                  paragraphs of text that explain the content. You can write
                  anything here - tutorials, thoughts, or updates about what
                  you're working on.
                </p>
                <p>
                  The text should be readable and well-structured. Each
                  paragraph adds value to the reader. Keep it concise but
                  informative.
                </p>
              </div>
            </article>
          </section>

          {/* Code Block */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">code block</p>
            <pre className="bg-muted p-4 rounded-none text-xs overflow-x-auto border border-border">
              <code>{`function hello() {
  const greeting = "hello world";
  console.log(greeting);
  return greeting;
}

// call the function
hello();`}</code>
            </pre>
          </section>

          {/* Blockquote */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">blockquote</p>
            <blockquote className="pl-4 border-l-2 border-primary py-1">
              <p className="text-sm italic">
                the best way to predict the future is to create it.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                — peter drucker
              </p>
            </blockquote>
          </section>

          {/* Lists */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">unordered list</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground mb-6">
              <li>first item in the list</li>
              <li>second item with more text</li>
              <li>third item</li>
              <li>fourth item</li>
            </ul>

            <p className="text-xs text-muted-foreground mb-4">ordered list</p>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>first step to do something</li>
              <li>second step with details</li>
              <li>third step</li>
              <li>fourth step</li>
            </ol>
          </section>

          {/* Newsletter Signup */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">
              newsletter signup
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your email"
                className="flex-1 px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-primary"
              />
              <button className="px-4 py-2 text-sm bg-foreground text-background hover:opacity-80">
                subscribe
              </button>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">social links</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {SOCIALS.map((social) => (
                <Link
                  key={social}
                  href={`#${social}`}
                  className="hover:text-primary"
                >
                  {social}
                </Link>
              ))}
            </div>
          </section>

          {/* Sidebar Layout */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">sidebar layout</p>
            <div className="grid md:grid-cols-[1fr_180px] gap-8 border-t border-b border-border py-6">
              <div>
                <h3 className="text-sm font-medium mb-2">main content</h3>
                <p className="text-xs text-muted-foreground">
                  This is the main content area. It takes up the majority of the
                  width and contains the primary information for the page.
                </p>
              </div>
              <div>
                <h3 className="text-xs text-muted-foreground mb-3">sidebar</h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href="#" className="hover:text-primary">
                      related post one
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary">
                      related post two
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary">
                      related post three
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">about section</p>
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2">about</h3>
              <p className="text-xs text-muted-foreground mb-3">
                developer based in sf. i build things and write about code,
                design, and everything in between.
              </p>
              <div className="flex gap-3 text-xs">
                <Link href="#" className="hover:text-foreground">
                  twitter
                </Link>
                <Link href="#" className="hover:text-foreground">
                  github
                </Link>
                <Link href="#" className="hover:text-foreground">
                  email
                </Link>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className="px-2 py-1 text-xs border border-border hover:border-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          {/* Pagination */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">pagination</p>
            <div className="flex gap-4 text-sm">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                ← prev
              </Link>
              <span className="text-xs text-muted-foreground">page 1 of 5</span>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                next →
              </Link>
            </div>
          </section>

          {/* Post List (for reference) */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">post list</p>
            {POSTS.map((post, i) => (
              <div key={post.id}>
                <Link href={`/blog/${post.id}`} className="block py-3 group">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm group-hover:text-primary">
                      {post.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.words} words
                    </span>
                  </div>
                </Link>
                {i < POSTS.length - 1 && <div className="h-px bg-border/50" />}
              </div>
            ))}
          </section>

          {/* Tags (for reference) */}
          <section>
            <p className="text-xs text-muted-foreground mb-4">tags</p>
            <div className="flex flex-wrap gap-2">
              {["javascript", "typescript", "react", "css", "design"].map(
                (tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="px-2 py-1 text-xs border border-border hover:border-foreground"
                  >
                    {tag}
                  </Link>
                )
              )}
            </div>
          </section>
        </main>

        <footer className="mt-16 pt-6 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>© 2026</span>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">
                rss
              </Link>
              <Link href="#" className="hover:text-foreground">
                twitter
              </Link>
              <Link href="#" className="hover:text-foreground">
                github
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
