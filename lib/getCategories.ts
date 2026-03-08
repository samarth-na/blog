import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";

const CONTENT_DIR = "blogs";

export async function getAllCategories(): Promise<string[]> {
  const localPath = path.join(process.cwd(), "content", CONTENT_DIR);
  if (!fs.existsSync(localPath)) {
    return [];
  }

  const files = fs.readdirSync(localPath).filter((f) => f.endsWith(".mdx"));
  const categories = new Set<string>();

  for (const file of files) {
    const content = fs.readFileSync(path.join(localPath, file), "utf8");
    const frontmatter = parseFrontmatter(content);
    if (frontmatter.category) {
      const categoryValue = frontmatter.category;
      if (Array.isArray(categoryValue)) {
        categoryValue.forEach((c) => categories.add(c));
      } else {
        categories.add(categoryValue);
      }
    }
  }

  return Array.from(categories).sort();
}
