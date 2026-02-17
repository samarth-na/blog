import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <p className="text-yellow-500 text-lg text-center align-middle font-serif">
        under contruction
      </p>
      <h3 className="text-2xl font-medium font-serif">
        software Architect and art enthusiast
      </h3>

      <p className="text-sm text-muted-foreground">
        Hello I&apos;m Samarth Nagar an undergraduate from India. This is a
        little corner I&apos;ve carved for my thoughts and works. I&apos;m
        currently in
        <Link
          href="https://www.google.com/search?q=indore"
          className="text-primary "
        >
          <span className="sr-only">GitHub</span>
          {` Indore `}
        </Link>
        studying to graduate as a software engineer in 2027.
      </p>

      <p className="text-sm text-muted-foreground">
        this is a combination of blog, portfolio and personal website.
      </p>
    </div>
  );
}
