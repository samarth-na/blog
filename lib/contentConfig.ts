import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";
const CONTENT_BASE_DIR = "content";

export const contentConfig = {
  isLocal: isDev,
  localPath: path.join(process.cwd(), CONTENT_BASE_DIR),
  repo: "samarth-na/content",
  branch: "main",
  baseUrl: "https://raw.githubusercontent.com/samarth-na/content/main",
};

export async function fetchContent(contentType: string, slug: string): Promise<string | null> {
  if (contentConfig.isLocal) {
    const filePath = path.join(contentConfig.localPath, contentType, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, "utf8");
  } else {
    const url = `${contentConfig.baseUrl}/${contentType}/${slug}.mdx`;
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      return null;
    }
    return response.text();
  }
}

export async function getContentFileList(contentType: string): Promise<string[]> {
  if (contentConfig.isLocal) {
    const contentDir = path.join(contentConfig.localPath, contentType);
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    const files = fs.readdirSync(contentDir);
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(".mdx", ""));
  } else {
    const url = `https://api.github.com/repos/${contentConfig.repo}/contents/${contentType}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data
      .filter((file: { name: string }) => file.name.endsWith(".mdx"))
      .map((file: { name: string }) => file.name.replace(".mdx", ""));
  }
}

export async function getContentItemsFromDir(
  contentDir: string,
  sortBy: string = "date",
  sortOrder: "asc" | "desc" = "desc",
): Promise<any[]> {
  if (contentConfig.isLocal) {
    const dirPath = path.join(contentConfig.localPath, contentDir);
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
    const items = files.map((file) => {
      const slug = file.replace(".mdx", "");
      const content = fs.readFileSync(path.join(dirPath, file), "utf8");
      const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?/m);
      return {
        slug,
        title: titleMatch ? titleMatch[1] : slug,
      };
    });

    if (sortBy === "title") {
      items.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return items;
  }
  return [];
}
