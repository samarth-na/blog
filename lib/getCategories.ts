import { getContentItemsFromDir } from "./contentConfig";

export async function getAllCategories(): Promise<string[]> {
  const items = await getContentItemsFromDir("blogs", "title", "asc");
  const categories = new Set<string>();

  for (const item of items) {
    if (item.category) {
      categories.add(item.category);
    }
  }

  return Array.from(categories).sort();
}
