/**
 * Shared frontmatter parsing utilities
 * Centralizes frontmatter extraction from MDX files
 */

export type FrontmatterValue = string | string[];

export type ParsedFrontmatter = Record<string, FrontmatterValue>;

/**
 * Parses YAML-style frontmatter from MDX content
 * Handles: key: value, key: "value", key: ['a', 'b'], key: [a, b]
 */
export function parseFrontmatter(content: string): ParsedFrontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};

  const frontmatter: ParsedFrontmatter = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle quoted strings
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Handle arrays
    if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Extracts body content from MDX (removes frontmatter)
 */
export function extractBody(content: string): string {
  return content.replace(/^---[\s\S]*?---\n/, "").trim();
}

/**
 * Safely gets a string value from frontmatter
 */
export function getStringValue(
  frontmatter: ParsedFrontmatter,
  key: string,
  defaultValue = ""
): string {
  const value = frontmatter[key];
  if (Array.isArray(value)) {
    return value[0] || defaultValue;
  }
  return value || defaultValue;
}

/**
 * Safely gets an array value from frontmatter
 */
export function getArrayValue(
  frontmatter: ParsedFrontmatter,
  key: string,
  defaultValue: string[] = []
): string[] {
  const value = frontmatter[key];
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : defaultValue;
}
