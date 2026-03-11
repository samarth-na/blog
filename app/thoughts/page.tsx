import { EditorialList } from "@/components/list/EditorialList";
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
      <p className="text-[11px] tracking-[0.24em] uppercase font-mono text-muted-foreground">
        Notes / Reflections
      </p>
      <h1 className="text-3xl md:text-4xl font-medium font-serif leading-[0.92] tracking-[-0.012em] text-balance">
        Thoughts
      </h1>
      <EditorialList items={listItems} type="thoughts" searchPlaceholder="Search thoughts..." />
    </div>
  );
}
