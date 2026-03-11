import { EditorialCard } from "@/components/list/EditorialCard";
import type { CardItem } from "@/components/list/types";
import { getArticlesByCategory } from "@/lib/content";

function toCardItem(item: any): CardItem {
  return {
    slug: item.slug,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    description: Array.isArray(item.excerpt) ? item.excerpt[0] : item.excerpt,
    date: item.date || "",
    readTime: item.readTime || item.read || "",
  };
}

export default async function WeeklogsPage() {
  const articles = await getArticlesByCategory("weeklog", "date", "desc");
  const cardItems: CardItem[] = articles.map((article) => toCardItem(article));

  return (
    <div className="space-y-8 animate-fade-in-down">
      <p className="text-[11px] tracking-[0.24em] uppercase font-mono text-muted-foreground">
        Dispatches / Weekly Notes
      </p>
      <h1 className="text-3xl md:text-4xl font-medium font-serif leading-[0.92] tracking-[-0.012em] text-balance">
        Weeklogs
      </h1>
      <EditorialCard
        items={cardItems}
        type="weeklogs"
        searchPlaceholder="Search weeklogs..."
        showCardTags={false}
        showCardReadTime={false}
        showCardDate
        metaInlineWithTitle
      />
    </div>
  );
}
