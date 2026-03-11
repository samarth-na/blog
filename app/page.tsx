import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6 animate-fade-in-down max-w-3xl">
      <div className="text-amber-500 text-[11px] tracking-[0.24em] uppercase font-mono  sm:text-left">
        under-construction
      </div>
      <h3 className="text-2xl md:text-4xl leading-[0.95] tracking-[-0.012em] font-medium font-serif text-foreground text-balance">
        Software Architect
      </h3>
      <p className="text-base leading-[1.55] text-muted-foreground max-w-2xl">
        Hello I'm samarth a tech enthusiast. with a keen interest in linux and software
        architecutre.
      </p>
      <p className="text-base leading-[1.55] text-muted-foreground max-w-2xl">
        I am full stack software engineer with experience in frontend using react and nextjs backend
        using typescript, bun and node, CI/CD with github actions and gitlabs, databases with sql no
        sql solutioins and system admin with ubuntu and fedora.{" "}
      </p>

      <p className="text-base leading-[1.55] text-muted-foreground max-w-2xl">
        I am currently an undergraduate student in India. this is my little corner ive carved for my
        works and thoughts. im currently in
        <Link href="https://www.google.com/search?q=indore" className="text-primary ">
          <span className="sr-only">GitHub</span>
          {` Indore `}
        </Link>
        studying to graduate as a software engineer in 2027.
      </p>
      <p className="text-base leading-[1.55] text-muted-foreground max-w-2xl">
        this is a combination of blog, portfolio and personal website. right now things are
        everywhere.
      </p>
    </div>
  );
}
