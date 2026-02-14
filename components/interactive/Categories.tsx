import Link from "next/link";

interface CategoriesProps {
  categories: string[];
  baseUrl?: string;
}

export function BlogCategories({
  categories,
  baseUrl = "/category",
}: CategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`${baseUrl}/${cat}`}
          className="px-2 py-1 text-xs  border border-border hover:border-foreground"
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
