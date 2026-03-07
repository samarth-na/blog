import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";

const CONTENT_DIR = "blogs";

export async function getAllContentTypes(): Promise<string[]> {
  const localPath = path.join(process.cwd(), "content", CONTENT_DIR);
  if (!fs.existsSync(localPath)) {
    return [];
  }

  const files = fs.readdirSync(localPath).filter((f) => f.endsWith(".mdx"));
  const types = new Set<string>();

  for (const file of files) {
    const content = fs.readFileSync(path.join(localPath, file), "utf8");
    const frontmatter = parseFrontmatter(content);
    if (frontmatter.type) {
      const typeValue = frontmatter.type;
      if (Array.isArray(typeValue)) {
        typeValue.forEach((t) => types.add(t));
      } else {
        types.add(typeValue);
      }
    }
  }

  return Array.from(types).sort();
}
