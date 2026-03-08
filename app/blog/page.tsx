import { CardList } from "@/components/list/CardList";
import type { CardItem } from "@/components/list/types";
import { getArticlesByCategory } from "@/lib/content";

function toCardItem(item: any): CardItem {
  return {
    slug: item.slug,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    description: Array.isArray(item.description) ? item.description[0] : item.description,
  };
}

export default async function BlogPage() {
  const articles = await getArticlesByCategory("blog", "date", "desc");
  const cardItems: CardItem[] = articles.map((article) => toCardItem(article));

  return (
    <div className="space-y-8 animate-fade-in-down">
      <h1 className="text-2xl font-medium font-serif">Blog</h1>
      <CardList items={cardItems} type="blog" searchPlaceholder="Search blogs..." />
    </div>
  );
}
