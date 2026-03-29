# Next.js → TanStack Start Migration Timeline

## Phase 0 — Pre-Migration Cleanup

- [ ] Remove unused dependencies (`fs`, `cloudflared`)
- [ ] Add `try/catch` to `getRemoteTree()` in `lib/contentConfig.ts`

## Phase 1 — Project Setup

- [ ] Initialize TanStack Start project (Vinxi + Vite)
- [ ] Set up Tailwind CSS v4 with existing config
- [ ] Configure TypeScript (match existing strict settings)
- [ ] Set up Biome for linting/formatting
- [ ] Verify Bun compatibility with TanStack Start toolchain

## Phase 2 — Content System

- [ ] Port `lib/frontmatter.ts` (YAML parser — framework-agnostic)
- [ ] Port `lib/contentConfig.ts` (GitHub fetch + local fallback)
- [ ] Port `lib/content.ts` (sorting, filtering, read time)
- [ ] Port `lib/getCategories.ts`
- [ ] Port `lib/typeConfig.ts`
- [ ] Port `lib/blog.ts`

## Phase 3 — Routing

- [ ] Create root layout route
- [ ] Create homepage route
- [ ] Create `/blog` listing route
- [ ] Create `/thoughts` listing route
- [ ] Create `/weeklogs` listing route
- [ ] Create `/now` route (MDX page)
- [ ] Create `/[category]/[slug]` dynamic content route
- [ ] Create 404 route

## Phase 4 — Components

- [ ] Port layout components (`Header`, `Footer`, `Container`)
- [ ] Port `ScrollRail` component
- [ ] Port list components (`CardList`, `List`, `EditorialCard`, `EditorialImageCard`, `EditorialList`)
- [ ] Port MDX rendering components
- [ ] Port `TypeTabs`, `BackToBlogLink`

## Phase 5 — Theme System

- [ ] Port `ThemeProvider` context
- [ ] Port `ThemeToggle` component
- [ ] Port FOUC prevention (inline theme script)
- [ ] Verify CSS variable theming works with TanStack Start's document setup

## Phase 6 — Fonts

- [ ] Set up font loading (no `next/font` — use `@fontsource` or manual `@font-face`)
- [ ] Port `config/fonts.ts` structure
- [ ] Verify `display: "optional"` equivalent behavior

## Phase 7 — Analytics

- [ ] Initialize PostHog in TanStack Start client entry
- [ ] Port event tracking across components
- [ ] Set up PostHog proxy rewrites (Vite dev server)

## Phase 8 — Deployment

- [ ] Choose hosting target (Vercel, Cloudflare, Netlify, etc.)
- [ ] Configure build output for target platform
- [ ] Set up ISR / revalidation equivalent (or static build)
- [ ] Configure image optimization
- [ ] Set environment variables

## Phase 9 — Verification & Cleanup

- [ ] Remove all Next.js dependencies and config
- [ ] Remove `next.config.ts`, `postcss.config.mjs` (if unused), `tsconfig.json` (replaced)
- [ ] Update `agents.md` for new toolchain
- [ ] Update `README.md`
- [ ] Verify lint (`bun run lint`), typecheck, and production build
- [ ] Test all routes and interactive features
- [ ] Remove migration-specific docs (`MIGRATION-REPORT.md`, `test-report.md`, `font.md`, `posthog-setup-report.md`)
