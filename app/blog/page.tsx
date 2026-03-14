import { EditorialImageCard } from "@/components/list/EditorialImageCard";
import type { CardItem } from "@/components/list/types";
import { type ContentItem, getArticlesByCategory } from "@/lib/content";

function toCardItem(item: ContentItem): CardItem {
  return {
    slug: item.slug,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    description: Array.isArray(item.description) ? item.description[0] : item.description,
    date: item.date || "",
    readTime: typeof item.readTime === "string" ? item.readTime : "",
  };
}

export default async function BlogPage() {
  const articles = await getArticlesByCategory("blog", "date", "desc");
  const cardItems: CardItem[] = articles.map((article) => toCardItem(article));

  return (
    <div className="space-y-8 animate-fade-in-down">
      <p className="text-[11px] tracking-[0.24em] uppercase font-mono text-muted-foreground">
        Issue 01 / Blog Chronicle
      </p>
      <h1 className="text-4xl md:text-4xl font-medium font-serif leading-[0.92] tracking-[-0.012em] text-balance">
        Blog
      </h1>
      <EditorialImageCard
        items={cardItems}
        type="blog"
        searchPlaceholder="Search blog posts..."
        showCardDate={false}
        showCardReadTime
      />
    </div>
  );
}
