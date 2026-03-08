import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4 animate-fade-in-down ">
      <div className="text-amber-500 text-xl text-center align-middle font-serif ">
        under construction
      </div>
      <h3 className="text-2xl font-medium font-serif">software Architect</h3>
      <p className="text-sm text-muted-foreground">
        Hello I'm samarth a tech enthusiast. with a keen interest in linux and software
        architecutre.
      </p>
      <p className="text-sm text-muted-foreground">
        I am full stack software engineer with experience in frontend using react and nextjs backend
        using typescript, bun and node, CI/CD with github actions and gitlabs, databases with sql no
        sql solutioins and system admin with ubuntu and fedora.{" "}
      </p>

      <p className="text-sm text-muted-foreground">
        I am currently an undergraduate student in India. this is my little corner ive carved for my
        works and thoughts. im currently in
        <Link href="https://www.google.com/search?q=indore" className="text-primary ">
          <span className="sr-only">GitHub</span>
          {` Indore `}
        </Link>
        studying to graduate as a software engineer in 2027.
      </p>
      <p className="text-sm text-muted-foreground">
        this is a combination of blog, portfolio and personal website. right now things are
        everywhere.
      </p>
    </div>
  );
}
