# AGENTS

## Fast start
- Use Bun (`bun.lock` is the lockfile of record): `bun install`.
- Dev server is `bun run dev` (this runs `next dev --webpack`, not Turbopack).
- Verification commands in this repo: `bun run lint`, `bun run check`, `bun run check:fix`, `bun run format`, `bun run build`.
- There is no test script; `bun run build` is the strongest built-in validation pass.

## App structure that matters
- Single Next.js App Router app (not a monorepo); route entrypoints are `app/**/page.tsx` and `app/**/route.ts`.
- Main content listing routes are `app/blog/page.tsx`, `app/thoughts/page.tsx`, and `app/weeklogs/page.tsx`.
- Post detail route is shared at `app/[category]/[slug]/page.tsx`.

## Content pipeline quirks
- Content loading is centralized in `lib/contentConfig.ts`.
- Source is `content/blogs/*.mdx` when local `content/blogs` exists; otherwise it fetches from `samarth-na/content` (`main`) with `revalidate=3600`.
- Important fallback behavior: if local `content/blogs` exists, remote is not used at all (even if local dir is empty or partial).
- `content/` may be absent locally by design; remote content then populates the site.
- Category mapping is asymmetric and easy to break: internal type is `weeklog`, URL segment is `weeklogs` (`lib/typeConfig.ts`). Preserve this conversion when editing routing/filtering.
- `getContentEntries("blog")`, `getContentEntries("thoughts")`, and `getContentEntries("weeklog")` all read from the same `blogs` source dir and then filter by frontmatter `category`.

## MDX and rendering
- MDX is enabled in `next.config.ts` (`@next/mdx`, `remark-gfm`, `pageExtensions` includes `md`/`mdx`).
- Global post rendering uses `next-mdx-remote/rsc` in `app/[category]/[slug]/page.tsx` with shared component mapping from `components/mdx/MDXComponents.tsx`.

## Conventions to preserve
- Keep imports using `@/*` alias (configured in `tsconfig.json`).
- Keep formatting/linting aligned with Biome config (double quotes, semicolons, trailing commas, 2-space indent).
- Optional env hooks used in code: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (analytics), and `FONT_SOURCE` (`google` or `local`, defaults to `local`).
