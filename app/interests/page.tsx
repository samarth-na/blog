import fs from "fs";
import path from "path";
import Link from "next/link";

export type Interest = {
  slug: string;
  title: string;
};

function getInterests(): Interest[] {
  const interestsDir = path.join(process.cwd(), "content/interests");
  
  if (!fs.existsSync(interestsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(interestsDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(interestsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const frontmatter = parseFrontmatter(content);

      return {
        slug: file.replace(".mdx", ""),
        title: frontmatter.title || file.replace(".mdx", ""),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function parseFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const frontmatter: Record<string, any> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

export default function InterestsPage() {
  const interests = getInterests();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "'IBM Plex Serif', serif" }}>Interests</h1>
      
      <div className="space-y-2 border-t border-border pt-8">
        {interests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No interests found.
          </p>
        ) : (
          interests.map((interest) => (
            <article key={interest.slug} className="group">
              <Link href={`/interests/${interest.slug}`} className="block">
                <h2 className="text-sm font-medium group-hover:text-primary transition-colors">
                  {interest.title}
                </h2>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
