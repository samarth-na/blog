import fs from "fs";
import path from "node:path";
import { cache } from "react";
import { type ParsedFrontmatter, getStringValue, parseFrontmatter } from "./frontmatter";

const CONTENT_BASE_DIR = "content";
const REMOTE_REVALIDATE_SECONDS = 3600;

type ContentTypeConfig = {
  sourceDir: string;
  category?: string;
};

export type ContentEntry = {
  slug: string;
  sourceDir: string;
  sourcePath: string;
  content: string;
  frontmatter: ParsedFrontmatter;
  title: string;
  category: string;
};

const CONTENT_TYPE_CONFIG: Record<string, ContentTypeConfig> = {
  blog: {
    sourceDir: "blogs",
    category: "blog",
  },
  thoughts: {
    sourceDir: "blogs",
    category: "thoughts",
  },
  weeklog: {
    sourceDir: "blogs",
    category: "weeklog",
  },
};

export const contentConfig = {
  localPath: path.join(process.cwd(), CONTENT_BASE_DIR),
  repo: "samarth-na/content",
  branch: "main",
  baseUrl: "https://raw.githubusercontent.com/samarth-na/content/main",
  treeApiUrl: "https://api.github.com/repos/samarth-na/content/git/trees/main?recursive=1",
  revalidate: REMOTE_REVALIDATE_SECONDS,
};

function logRemoteContentWarning(message: string): void {
  console.warn(`[contentConfig] ${message}`);
}

function getTypeConfig(contentType: string): ContentTypeConfig {
  return (
    CONTENT_TYPE_CONFIG[contentType] ?? {
      sourceDir: contentType,
    }
  );
}

function sortItems<T extends Record<string, unknown>>(
  items: T[],
  sortBy: string,
  sortOrder: "asc" | "desc",
): T[] {
  return [...items].sort((a, b) => {
    const aValue = Array.isArray(a[sortBy]) ? a[sortBy]?.[0] : a[sortBy];
    const bValue = Array.isArray(b[sortBy]) ? b[sortBy]?.[0] : b[sortBy];
    const aComparable = typeof aValue === "string" ? aValue : "";
    const bComparable = typeof bValue === "string" ? bValue : "";

    if (sortBy === "date") {
      const aDate = new Date(aComparable);
      const bDate = new Date(bComparable);

      if (!Number.isNaN(aDate.getTime()) && !Number.isNaN(bDate.getTime())) {
        return sortOrder === "desc"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      }
    }

    const comparison = aComparable.localeCompare(bComparable);
    return sortOrder === "asc" ? comparison : -comparison;
  });
}

const getRemoteTree = cache(async (): Promise<string[]> => {
  try {
    const response = await fetch(contentConfig.treeApiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: contentConfig.revalidate },
    });

    if (!response.ok) {
      logRemoteContentWarning(
        `Failed to fetch remote tree (${response.status} ${response.statusText}) from ${contentConfig.treeApiUrl}.`,
      );
      return [];
    }

    const data = (await response.json()) as {
      tree?: Array<{ path: string; type: string }>;
    };

    return (data.tree ?? [])
      .filter((entry) => entry.type === "blob" && entry.path.endsWith(".mdx"))
      .map((entry) => entry.path);
  } catch (error) {
    logRemoteContentWarning(
      `Error fetching remote tree from ${contentConfig.treeApiUrl}: ${error instanceof Error ? error.message : "Unknown error"}.`,
    );
    return [];
  }
});

const fetchRemoteFile = cache(async (filePath: string): Promise<string | null> => {
  const targetUrl = `${contentConfig.baseUrl}/${filePath}`;

  try {
    const response = await fetch(targetUrl, {
      next: { revalidate: contentConfig.revalidate },
    });

    if (!response.ok) {
      logRemoteContentWarning(
        `Failed to fetch remote content file (${response.status} ${response.statusText}) from ${targetUrl}.`,
      );
      return null;
    }

    return response.text();
  } catch (error) {
    logRemoteContentWarning(
      `Error fetching remote content file from ${targetUrl}: ${error instanceof Error ? error.message : "Unknown error"}.`,
    );
    return null;
  }
});

const getDirectoryEntries = cache(async (sourceDir: string): Promise<ContentEntry[]> => {
  const localDirPath = path.join(contentConfig.localPath, sourceDir);
  const hasLocalDirectory = fs.existsSync(localDirPath);

  let filePaths: string[] = [];

  if (hasLocalDirectory) {
    filePaths = fs
      .readdirSync(localDirPath)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => `${sourceDir}/${file}`);
  } else {
    const remoteTree = await getRemoteTree();
    filePaths = remoteTree.filter((filePath) => filePath.startsWith(`${sourceDir}/`));
  }

  const items = await Promise.all(
    filePaths.map(async (filePath) => {
      const slug = path.basename(filePath, ".mdx");
      const content = hasLocalDirectory
        ? fs.readFileSync(path.join(contentConfig.localPath, filePath), "utf8")
        : await fetchRemoteFile(filePath);

      if (!content) {
        return null;
      }

      const frontmatter = parseFrontmatter(content);

      return {
        slug,
        sourceDir,
        sourcePath: filePath,
        content,
        frontmatter,
        title: getStringValue(frontmatter, "title", slug),
        category: getStringValue(frontmatter, "category"),
      } satisfies ContentEntry;
    }),
  );

  return items.filter((item): item is ContentEntry => item !== null);
});

export async function getContentEntries(contentType: string): Promise<ContentEntry[]> {
  const config = getTypeConfig(contentType);
  const items = await getDirectoryEntries(config.sourceDir);

  if (!config.category) {
    return items;
  }

  return items.filter((item) => item.category === config.category);
}

export async function fetchContent(contentType: string, slug: string): Promise<string | null> {
  const items = await getContentEntries(contentType);
  return items.find((item) => item.slug === slug)?.content ?? null;
}

export async function getContentFileList(contentType: string): Promise<string[]> {
  const items = await getContentEntries(contentType);
  return items.map((item) => item.slug);
}

export async function getContentItemsFromDir(
  contentDir: string,
  sortBy = "date",
  sortOrder: "asc" | "desc" = "desc",
): Promise<Array<{ slug: string; title: string; category?: string }>> {
  const items = await getDirectoryEntries(contentDir);

  return sortItems(
    items.map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category || undefined,
    })),
    sortBy,
    sortOrder,
  );
}
