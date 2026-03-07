import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { parseFrontmatter } from "@/lib/frontmatter";

export async function GET() {
  const CONTENT_DIR = path.join(process.cwd(), "content", "blogs");

  if (!fs.existsSync(CONTENT_DIR)) {
    return NextResponse.json([]);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const types = new Set<string>();

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
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

  return NextResponse.json(Array.from(types).sort());
}
