import Link from "next/link";
import { contentConfig } from "@/lib/contentConfig";

export type Interest = {
  slug: string;
  title: string;
};

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const frontmatter: Record<string, string> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      frontmatter[key] = value.slice(1, -1);
    } else {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

async function getInterests(): Promise<Interest[]> {
  const url = `https://api.github.com/repos/${contentConfig.repo}/contents/interests`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const slugs = data
    .filter((file: { name: string }) => file.name.endsWith(".mdx"))
    .map((file: { name: string }) => file.name.replace(".mdx", ""));

  const interests = await Promise.all(
    slugs.map(async (slug: string) => {
      const contentUrl = `${contentConfig.baseUrl}/interests/${slug}.mdx`;
      const contentResponse = await fetch(contentUrl);
      
      if (!contentResponse.ok) {
        return null;
      }

      const content = await contentResponse.text();
      const frontmatter = parseFrontmatter(content);

      return {
        slug,
        title: frontmatter.title || slug,
      };
    })
  );

  return interests
    .filter((i): i is Interest => i !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export default async function InterestsPage() {
  const interests = await getInterests();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium font-serif">Interests</h1>
      
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
