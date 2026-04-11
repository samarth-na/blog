import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    {
      title: "Assistant",
      description:
        "A fast, privacy-focused AI assistant built with local LLMs and natural language processing. Engineered for speed and offline capabilities.",
      url: "https://github.com/samarth-na/assistant/",
      image: "/zed-hero.webp",
      tags: ["AI", "Local LLMs", "NLP", "Privacy"],
      year: "2026",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-down">
      <div className="">
        <p className="text-[11px] tracking-[0.24em] uppercase font-mono text-muted-foreground">
          / Selected Work
        </p>
      </div>

      <h1 className="text-4xl md:text-4xl font-medium font-serif leading-[0.92] tracking-[-0.012em] text-balance">
        Projects
      </h1>

      <div className="flex flex-col gap-32">
        {projects.map((project) => (
          <div key={project.url} className="group relative flex flex-col gap-6">
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative aspect-[4/3] w-full overflow-hidden bg-muted/20"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                priority={true}
              />
            </Link>

            {/* Text Information Bottom - Fade In Effect on Hover */}
            <div className="flex flex-col gap-3 opacity-60 translate-y-2 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex items-baseline justify-between gap-4 border-b border-border/40 pb-4">
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/title inline-flex items-center gap-3"
                >
                  <h2 className="text-3xl md:text-4xl font-serif font-medium leading-[0.95] tracking-[-0.01em]">
                    {project.title}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-transform duration-500 group-hover/title:translate-x-1 group-hover/title:-translate-y-1" />
                </Link>
                <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-muted-foreground hidden sm:block">
                  {project.year}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
                <p className="text-base text-muted-foreground leading-[1.55] max-w-2xl">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 items-start shrink-0">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] tracking-[0.15em] uppercase font-mono text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
