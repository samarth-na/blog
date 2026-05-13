# MDX Content System Documentation

## Overview

This Next.js app uses a **hybrid MDX rendering system** with `next-mdx-remote` for dynamic content loading from either local files or a remote GitHub repository.

---

## Architecture

### Content Sources

Content can come from two sources (mutually exclusive):

1. **Local**: `content/blogs/*.mdx` directory
2. **Remote**: `samarth-na/content` GitHub repo (main branch)

**Important**: If `content/blogs` directory exists locally, remote content is **never** used—even if the directory is empty.

### Key Dependencies

```json
{
  "@mdx-js/loader": "^3.1.1",
  "@mdx-js/react": "^3.1.1",
  "@next/mdx": "^16.1.6",
  "next-mdx-remote": "^6.0.0",
  "remark-gfm": "^4.0.1",
  "rehype-pretty-code": "^0.14.1"
}
```

---

## File Structure

```
app/
├── [category]/[slug]/page.tsx    # Dynamic route for all post types
├── blog/page.tsx                  # Blog listing
├── thoughts/page.tsx              # Thoughts listing
├── weeklogs/page.tsx              # Weeklogs listing
└── now/                           # Special MDX page with custom layout

lib/
├── contentConfig.ts               # Content loading logic (local vs remote)
├── content.ts                     # Content transformation & filtering
├── frontmatter.ts                 # YAML frontmatter parsing
└── typeConfig.ts                  # URL ↔ internal type mapping

mdx-components.tsx                 # MDX component mapping
```

---

## Content Pipeline

### 1. Content Loading (`lib/contentConfig.ts`)

```typescript
// Central entry point
getContentEntries(contentType: string): Promise<ContentEntry[]>
```

**Flow**:
1. Check if `content/blogs` directory exists locally
2. If yes: read all `.mdx` files from local directory
3. If no: fetch file list from GitHub API, then fetch each file
4. Parse frontmatter from each file
5. Filter by category based on `CONTENT_TYPE_CONFIG`

**Content Type Config**:
```typescript
const CONTENT_TYPE_CONFIG = {
  blog: { sourceDir: "blogs", category: "blog" },
  thoughts: { sourceDir: "blogs", category: "thoughts" },
  weeklog: { sourceDir: "blogs", category: "weeklog" },
};
```

All three types read from the same `blogs/` directory and filter by frontmatter `category` field.

### 2. Frontmatter Parsing (`lib/frontmatter.ts`)

Custom YAML-like parser (not full YAML):

```typescript
// Parses:
---
title: My Post
date: 2024-01-15
tags: [react, nextjs]
category: blog
---

// Returns:
{
  title: "My Post",
  date: "2024-01-15",
  tags: ["react", "nextjs"],
  category: "blog"
}
```

**Supported formats**:
- Strings: `key: value` or `key: "value"`
- Arrays: `key: [a, b, c]` or `key: ['a', 'b']`

**Key functions**:
- `parseFrontmatter(content)`: Extract frontmatter object
- `extractBody(content)`: Remove frontmatter, return MDX body
- `getStringValue(frontmatter, key, default)`: Safe string access
- `getArrayValue(frontmatter, key, default)`: Safe array access

### 3. Content Transformation (`lib/content.ts`)

```typescript
// Main API for list pages
getArticlesByCategory(category, sortBy, sortOrder)

// For detail pages
getContentItem(contentType, slug)
```

**ContentItem structure**:
```typescript
{
  slug: string;
  title: string;
  category: string;
  date?: string;
  tags: string[];
  excerpt?: string;
  readTime: string;  // Auto-calculated if not in frontmatter
}
```

**Read time calculation**:
```typescript
// 200 words per minute
const minutes = Math.ceil(words / 200);
```

---

## List Pages

All list pages follow the same pattern:

### Blog Page (`app/blog/page.tsx`)

```typescript
export default async function BlogPage() {
  const articles = await getArticlesByCategory("blog", "date", "desc");
  const cardItems: CardItem[] = articles.map(toCardItem);
  
  return <EditorialImageCard items={cardItems} type="blog" />;
}
```

### Thoughts Page (`app/thoughts/page.tsx`)

```typescript
export default async function ThoughtsPage() {
  const articles = await getArticlesByCategory("thoughts", "date", "desc");
  const listItems: ListItem[] = articles.map(toListItem);
  
  return <EditorialList items={listItems} type="thoughts" />;
}
```

### Weeklogs Page (`app/weeklogs/page.tsx`)

```typescript
export default async function WeeklogsPage() {
  const articles = await getArticlesByCategory("weeklog", "date", "desc");
  const cardItems: CardItem[] = articles.map(toCardItem);
  
  return <EditorialCard items={cardItems} type="weeklogs" />;
}
```

**Note**: Weeklogs uses URL segment `weeklogs` but internal type is `weeklog` (see Type Mapping below).

---

## Type Mapping (`lib/typeConfig.ts`)

Asymmetric mapping between internal types and URL segments:

```typescript
// Internal → URL
typeToUrl("weeklog") → "/weeklogs"
typeToUrl("blog") → "/blog"
typeToUrl("thoughts") → "/thoughts"

// URL → Internal
urlSegmentToType("weeklogs") → "weeklog"
urlSegmentToType("blog") → "blog"
urlSegmentToType("thoughts") → "thoughts"
```

This is critical for routing and must be preserved.

---

## Detail Page (`app/[category]/[slug]/page.tsx`)

### Static Params Generation

```typescript
export async function generateStaticParams() {
  const [blogPosts, thoughtPosts, weeklogPosts] = await Promise.all([
    getArticlesByCategory("blog"),
    getArticlesByCategory("thoughts"),
    getArticlesByCategory("weeklog"),
  ]);

  return [...blogPosts, ...thoughtPosts, ...weeklogPosts].map((post) => ({
    category: post.category === "weeklog" ? "weeklogs" : post.category,
    slug: post.slug,
  }));
}
```

### Rendering

```typescript
export default async function BlogPost({ params }) {
  const { category, slug } = await params;
  const normalizedCategory = urlSegmentToType(category);
  const post = await getContentItem(normalizedCategory, slug);
  
  return (
    <MDXRemote
      source={post.content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          // rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]] // Not currently used
        },
      }}
    />
  );
}
```

---

## MDX Components (`mdx-components.tsx`)

Maps HTML elements to styled React components:

```typescript
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="mdx-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="mdx-h2">{children}</h2>,
    // ... h3-h6, p, a, strong, em, code, pre, ul, ol, li, blockquote, hr, table
    ...components,
  };
}
```

**CSS classes** are defined in `app/globals.css` (lines 246-389) with Tailwind utilities.

### Special Components

- `a`: Uses Next.js `Link` component for client-side navigation
- `table`: Wrapped in scrollable container (`.mdx-table-wrapper`)
- `pre`: Styled for code blocks with border and rounded corners

---

## List Components Architecture

### Component Hierarchy

```
List Pages
├── EditorialImageCard (blog)
│   └── CardList (with showImage=true)
├── EditorialCard (weeklogs)
│   └── CardList (with showImage=false)
└── EditorialList (thoughts)
    └── List
```

### CardList (`components/list/CardList.tsx`)

**Features**:
- Client-side search (by title/description)
- Tag filtering with multi-select
- PostHog analytics tracking
- Grid layout (2 columns on md+)
- Optional image display
- Configurable metadata display (date, readTime, tags)

**Props**:
```typescript
{
  items: CardItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showImage?: boolean;
  showCardTags?: boolean;
  showCardDate?: boolean;
  showCardReadTime?: boolean;
  metaInlineWithTitle?: boolean;
}
```

**CardItem type**:
```typescript
{
  slug: string;
  title: string;
  image?: string;
  tags: string[];
  description?: string;
  date: string;
  readTime: string;
}
```

### List (`components/list/List.tsx`)

**Features**:
- Client-side search (by title/excerpt)
- Tag filtering with multi-select
- View mode toggle (full/minimal)
- PostHog analytics tracking

**View modes**:
- **Full**: Cards with excerpt, tags, metadata
- **Minimal**: Compact list with title + metadata only

**Props**:
```typescript
{
  items: ListItem[];
  type: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  defaultView?: "full" | "minimal";
}
```

**ListItem type**:
```typescript
{
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  excerpt?: string;
}
```

---

## Caching Strategy

### React Cache

`lib/contentConfig.ts` uses React's `cache()`:

```typescript
const getRemoteTree = cache(async (): Promise<string[]> => { ... });
const fetchRemoteFile = cache(async (filePath: string): Promise<string | null> => { ... });
const getDirectoryEntries = cache(async (sourceDir: string): Promise<ContentEntry[]> => { ... });
```

### Next.js Revalidation

Remote content is revalidated every 3600 seconds (1 hour):

```typescript
const REMOTE_REVALIDATE_SECONDS = 3600;

fetch(url, {
  next: { revalidate: REMOTE_REVALIDATE_SECONDS }
});
```

---

## Next.js Config (`next.config.ts`)

```typescript
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  compress: true,
  poweredByHeader: false,
  // ...rewrites for PostHog
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
```

**Note**: `@next/mdx` is configured but not actively used for page compilation. All MDX rendering happens via `next-mdx-remote`.

---

## Special Pages

### /now Page (`app/now/page.mdx`)

Uses a custom layout with MDX:

```typescript
// app/now/layout.tsx
export function useMDXComponents(componentsFromProps: MDXComponents): MDXComponents {
  return buildMDXComponents(componentsFromProps);
}

export default function NowLayout({ children }) {
  return (
    <div className="prose max-w-none">
      <p className="text-[11px] tracking-[0.24em] uppercase">/ Current Snapshot</p>
      <h1>Now</h1>
      {children}
    </div>
  );
}
```

---

## Key Patterns

### 1. Data Transformation in List Pages

Each list page transforms `ContentItem` → component-specific type:

```typescript
function toCardItem(item: ContentItem): CardItem {
  return {
    slug: item.slug,
    title: item.title,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? [item.tags] : [],
    description: Array.isArray(item.description) ? item.description[0] : item.description,
    date: item.date || "",
    readTime: typeof item.readTime === "string" ? item.readTime : "",
  };
}
```

**Why**: Frontmatter values can be strings or arrays; this normalizes them.

### 2. Category Normalization in Detail Page

```typescript
const normalizedCategory = urlSegmentToType(category);
```

Converts URL segment (`weeklogs`) to internal type (`weeklog`).

### 3. Shared Source Directory

All content types read from `content/blogs/` and filter by frontmatter:

```typescript
// CONTENT_TYPE_CONFIG
blog: { sourceDir: "blogs", category: "blog" }
thoughts: { sourceDir: "blogs", category: "thoughts" }
weeklog: { sourceDir: "blogs", category: "weeklog" }
```

---

## Analytics (PostHog)

List components track:
- Search usage (`card_list_search_used`, `list_search_used`)
- Tag filtering (`card_list_tag_toggled`, `list_tag_toggled`)
- Item clicks (`card_list_item_clicked`, `list_item_clicked`)
- View mode changes (`list_view_mode_changed`)

Events include `type`, `query`, `results`, `tags`, etc.

---

## Common Gotchas

1. **Local directory overrides remote**: If `content/blogs` exists, remote is never used
2. **Weeklog type mapping**: Internal type is `weeklog`, URL is `weeklogs`
3. **Frontmatter arrays**: Can be string or array, must normalize in list pages
4. **Caching**: `cache()` is per-request; `revalidate` controls remote refetch
5. **MDX rendering**: Uses `next-mdx-remote/rsc`, not `@next/mdx` page compilation

---

## Adding New Content Types

1. Add to `CONTENT_TYPE_CONFIG` in `lib/contentConfig.ts`
2. Add URL mapping in `lib/typeConfig.ts` if needed
3. Create list page in `app/{type}/page.tsx`
4. Create transformation function (ContentItem → component type)
5. Choose list component (CardList or List)

---

## File Conventions

### MDX Frontmatter Required Fields

```yaml
---
title: "Post Title"
date: "2024-01-15"
category: "blog"  # or "thoughts" or "weeklog"
tags: [tag1, tag2]
---
```

### Optional Fields

```yaml
excerpt: "Short description"
image: "/path/to/image.jpg"
read: "5 min read"  # Auto-calculated if omitted
draft: true  # Not currently implemented
```

---

## Commands

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build (strongest validation)
bun run build

# Lint/format
bun run lint
bun run format
bun run check
bun run check:fix
```
