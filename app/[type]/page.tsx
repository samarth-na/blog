import { notFound } from "next/navigation";
import { CardList } from "@/components/list/CardList";
import { List } from "@/components/list/List";
import type { CardItem, ListItem } from "@/components/list/types";
import { getArticlesByType } from "@/lib/content";
import { getAllContentTypes } from "@/lib/getContentTypes";
import { typeToLabel } from "@/lib/typeConfig";

function toCardItem(item: any): CardItem {
  return {
    slug: item.slug,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    description: Array.isArray(item.description) ? item.description[0] : item.description,
  };
}

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

export async function generateStaticParams() {
  const types = await getAllContentTypes();
  return types.map((type) => ({
    type,
  }));
}

export default async function TypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const articles = await getArticlesByType(type, "date", "desc");

  if (articles.length === 0) {
    notFound();
  }

  if (type === "blog") {
    const cardItems: CardItem[] = articles.map((article) => toCardItem(article));
    return (
      <div className="space-y-8 animate-fade-in-down">
        <h1 className="text-2xl font-medium font-serif">{typeToLabel(type)}</h1>
        <CardList items={cardItems} type={type} searchPlaceholder="Search blogs..." />
      </div>
    );
  }

  const listItems: ListItem[] = articles.map((article) => toListItem(article));
  return (
    <div className="space-y-8 animate-fade-in-down">
      <h1 className="text-2xl font-medium font-serif">{typeToLabel(type)}</h1>
      <List items={listItems} type={type} searchPlaceholder="Search posts..." />
    </div>
  );
}
