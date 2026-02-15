import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

export const contentConfig = {
  isLocal: isDev,
  localPath: path.join(process.cwd(), "content"),
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
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(".mdx", ""));
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
