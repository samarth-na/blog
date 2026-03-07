import { InterestList } from "@/components/interests/InterestList";
import { getContentItemsFromDir } from "@/lib/contentConfig";
import type { Interest } from "@/types/interest";

async function getInterests(): Promise<Interest[]> {
  const items = await getContentItemsFromDir("interests", "title", "asc");
  return items.map((item: any) => ({
    slug: item.slug,
    title: item.title,
  }));
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
