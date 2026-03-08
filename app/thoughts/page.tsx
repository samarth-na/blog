import { List } from "@/components/list/List";
import type { ListItem } from "@/components/list/types";
import { getArticlesByCategory } from "@/lib/content";

function toListItem(item: any): ListItem {
  return {
    slug: item.slug,
    title: item.title,
    date: item.date || "",
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    readTime: item.readTime || item.read || "",
    excerpt: Array.isArray(item.excerpt) ? item.excerpt[0] : item.excerpt,
  };
}

export default async function ThoughtsPage() {
  const articles = await getArticlesByCategory("thoughts", "date", "desc");
  const listItems: ListItem[] = articles.map((article) => toListItem(article));

  return (
    <div className="space-y-8 animate-fade-in-down">
      <h1 className="text-2xl font-medium font-serif">Thoughts</h1>
      <List items={listItems} type="thoughts" searchPlaceholder="Search thoughts..." />
    </div>
  );
}
