import { fetchContent, getContentFileList } from "@/lib/contentConfig";
import { InterestList } from "@/components/interests/InterestList";

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
  const slugs = await getContentFileList("interests");

  const interests = await Promise.all(
    slugs.map(async (slug) => {
      const content = await fetchContent("interests", slug);
      if (!content) {
        return null;
      }

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
      <InterestList interests={interests} />
    </div>
  );
}
